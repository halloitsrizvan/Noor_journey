import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { ClockService } from "@/common/clock/clock.service";
import { AttemptStatus, PublishState, RewardReason } from "@prisma/client";

@Injectable()
export class AttemptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: ClockService,
  ) {}

  async createAttempt(childProfileId: string, missionId: string, versionId?: string) {
    let missionVersionId = versionId;

    if (!missionVersionId) {
      const mission = await this.prisma.mission.findUnique({
        where: { id: missionId },
        include: {
          versions: {
            where: { publishState: PublishState.PUBLISHED },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!mission || !mission.versions[0]) {
        throw new NotFoundException({
          errorCode: "MISSION_NOT_FOUND",
          message: "No published version available for this mission.",
        });
      }
      missionVersionId = mission.versions[0].id;
    }

    return this.prisma.missionAttempt.create({
      data: {
        childProfileId,
        missionVersionId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: this.clock.now(),
      },
      include: {
        missionVersion: {
          select: {
            id: true,
            versionString: true,
            mission: { select: { id: true, titleMl: true, titleEn: true } },
          },
        },
      },
    });
  }

  async getAttempt(attemptId: string) {
    const attempt = await this.prisma.missionAttempt.findUnique({
      where: { id: attemptId },
      include: {
        submissions: true,
        checkpoints: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException({
        errorCode: "ATTEMPT_NOT_FOUND",
        message: "Attempt not found.",
      });
    }

    return attempt;
  }

  async submitActivity(attemptId: string, activityId: string, payload: any) {
    const attempt = await this.prisma.missionAttempt.findUnique({
      where: { id: attemptId },
      include: { missionVersion: true },
    });

    if (!attempt || attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException({
        errorCode: "ATTEMPT_INVALID",
        message: "Attempt is not active.",
      });
    }

    const activities = attempt.missionVersion.activitiesJson as any[];
    const activity = activities.find((a) => a.id === activityId);

    if (!activity) {
      throw new NotFoundException({
        errorCode: "ACTIVITY_NOT_FOUND",
        message: "Activity not found in this mission.",
      });
    }

    // Server-side grading of activity
    let isCorrect = false;
    let feedbackMl = activity.explainWrong?.ml || "ഒന്നുകൂടി ചിന്തിക്കാം.";
    let feedbackEn = activity.explainWrong?.en || "Let's review this together.";

    if (activity.kind === "choice") {
      isCorrect = payload === activity.correctId || payload?.choiceId === activity.correctId;
    } else if (activity.kind === "match") {
      // payload is array of matched pair IDs
      const requiredPairIds = (activity.pairs || []).map((p: any) => p.id);
      const submittedIds = Array.isArray(payload) ? payload : payload?.pairs || [];
      isCorrect = requiredPairIds.every((id: string) => submittedIds.includes(id));
    } else if (activity.kind === "sequence") {
      // payload is array of step IDs in order
      const correctOrder = (activity.steps || []).map((s: any) => s.id);
      const submittedOrder = Array.isArray(payload) ? payload : payload?.steps || [];
      isCorrect =
        correctOrder.length === submittedOrder.length &&
        correctOrder.every((id: string, i: number) => id === submittedOrder[i]);
    }

    if (isCorrect) {
      feedbackMl = activity.explainCorrect?.ml || "ശരിയുത്തരം! മികച്ച ചിന്ത.";
      feedbackEn = activity.explainCorrect?.en || "Correct! Well reasoned.";
    }

    const submission = await this.prisma.activitySubmission.create({
      data: {
        attemptId,
        activityId,
        payloadJson: payload,
        isCorrect,
        feedbackMl,
        feedbackEn,
        submittedAt: this.clock.now(),
      },
    });

    return {
      submissionId: submission.id,
      isCorrect,
      feedback: { ml: feedbackMl, en: feedbackEn },
    };
  }

  async createCheckpoint(attemptId: string) {
    const attempt = await this.prisma.missionAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException({
        errorCode: "ATTEMPT_INVALID",
        message: "Attempt is not active.",
      });
    }

    return this.prisma.checkpointAttempt.create({
      data: {
        attemptId,
        score: 0,
        maxScore: 4,
        passed: false,
        answersJson: [],
      },
    });
  }

  async submitCheckpointAnswer(
    checkpointId: string,
    questionId: string,
    choiceId: string,
  ) {
    const checkpoint = await this.prisma.checkpointAttempt.findUnique({
      where: { id: checkpointId },
      include: {
        attempt: {
          include: { missionVersion: true },
        },
      },
    });

    if (!checkpoint) {
      throw new NotFoundException({
        errorCode: "CHECKPOINT_NOT_FOUND",
        message: "Checkpoint attempt not found.",
      });
    }

    const pool = checkpoint.attempt.missionVersion.checkpointPoolJson as any[];
    const question = pool.find((q) => q.id === questionId);

    if (!question) {
      throw new NotFoundException({
        errorCode: "QUESTION_NOT_FOUND",
        message: "Question not found in checkpoint pool.",
      });
    }

    const isCorrect = choiceId === question.correctId;
    const feedback = isCorrect ? question.explainCorrect : question.explainWrong;

    // Update checkpoint answers
    const existingAnswers = (checkpoint.answersJson as any[]) || [];
    const updatedAnswers = [
      ...existingAnswers.filter((a) => a.questionId !== questionId),
      { questionId, choiceId, isCorrect },
    ];

    const currentScore = updatedAnswers.filter((a) => a.isCorrect).length;

    await this.prisma.checkpointAttempt.update({
      where: { id: checkpointId },
      data: {
        score: currentScore,
        answersJson: updatedAnswers,
      },
    });

    return {
      isCorrect,
      feedback: {
        ml: feedback?.ml || (isCorrect ? "ശരിയുത്തരം!" : "ഒന്നുകൂടി ചിന്തിക്കാം."),
        en: feedback?.en || (isCorrect ? "Correct!" : "Let's review this."),
      },
      currentScore,
      totalAnswered: updatedAnswers.length,
    };
  }

  async finalizeCheckpoint(
    childProfileId: string,
    checkpointId: string,
    idempotencyKey?: string,
  ) {
    const checkpoint = await this.prisma.checkpointAttempt.findUnique({
      where: { id: checkpointId },
      include: {
        attempt: {
          include: {
            missionVersion: {
              include: {
                mission: {
                  include: {
                    learningChapter: {
                      include: {
                        missions: { select: { id: true } },
                        badge: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!checkpoint) {
      throw new NotFoundException({
        errorCode: "CHECKPOINT_NOT_FOUND",
        message: "Checkpoint not found.",
      });
    }

    const mission = checkpoint.attempt.missionVersion.mission;
    const missionId = mission.id;
    const chapter = mission.learningChapter;

    // Check idempotency if key provided
    const effectiveKey = idempotencyKey || `finalize-checkpoint-${checkpointId}`;
    const existingReward = await this.prisma.rewardTransaction.findUnique({
      where: { idempotencyKey: effectiveKey },
    });

    // Check passing mark: score >= 3 out of 4
    const answers = (checkpoint.answersJson as any[]) || [];
    const score = answers.filter((a) => a.isCorrect).length;
    const passed = score >= 3;

    const now = this.clock.now();

    // Run ATOMIC TRANSACTION for completion, rewards, reviews, and progress increment
    return this.prisma.$transaction(async (tx) => {
      // 1. Update Checkpoint Attempt
      await tx.checkpointAttempt.update({
        where: { id: checkpointId },
        data: {
          score,
          passed,
          passedAt: passed ? now : null,
        },
      });

      // 2. Update Mission Attempt Status
      const updatedAttempt = await tx.missionAttempt.update({
        where: { id: checkpoint.attemptId },
        data: {
          status: passed ? AttemptStatus.PASSED : AttemptStatus.FAILED,
          completedAt: now,
          progressRevision: { increment: 1 },
        },
      });

      if (!passed) {
        return {
          passed: false,
          score,
          maxScore: 4,
          xpEarned: 0,
          newBadgeUnlocked: false,
          progressRevision: updatedAttempt.progressRevision,
          message: "Score below threshold (3/4). Supported review offered.",
        };
      }

      // Check if this is the child's first completion of this mission
      const existingCompletion = await tx.missionCompletion.findUnique({
        where: {
          childProfileId_missionId: { childProfileId, missionId },
        },
      });

      const isFirstCompletion = !existingCompletion;
      let xpEarned = 0;

      if (isFirstCompletion) {
        xpEarned = 20;

        await tx.missionCompletion.create({
          data: {
            childProfileId,
            missionId,
            missionVersionId: checkpoint.attempt.missionVersionId,
            firstCompletedAt: now,
            completedCount: 1,
          },
        });

        // Award 20 XP with deduplication
        if (!existingReward) {
          await tx.rewardTransaction.create({
            data: {
              idempotencyKey: effectiveKey,
              childProfileId,
              amount: 20,
              reason: RewardReason.MISSION_COMPLETION,
              referenceId: missionId,
              createdAt: now,
            },
          });
        }

        // Schedule first review (+1 day)
        const dueAt = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        await tx.reviewSchedule.upsert({
          where: {
            childProfileId_missionId_stage: {
              childProfileId,
              missionId,
              stage: 0,
            },
          },
          update: { dueAt },
          create: {
            childProfileId,
            missionId,
            stage: 0,
            dueAt,
          },
        });
      } else {
        // Replay of already completed mission -> no additional XP
        await tx.missionCompletion.update({
          where: { id: existingCompletion.id },
          data: { completedCount: { increment: 1 } },
        });
      }

      // Check if all chapter missions are completed to award Chapter Badge
      let newBadgeUnlocked = false;
      const allChapterMissionIds = chapter.missions.map((m) => m.id);
      const allCompleted = await tx.missionCompletion.findMany({
        where: {
          childProfileId,
          missionId: { in: allChapterMissionIds },
        },
      });

      if (allCompleted.length >= allChapterMissionIds.length && chapter.badge) {
        const existingBadgeAward = await tx.badgeAward.findUnique({
          where: {
            childProfileId_badgeId: {
              childProfileId,
              badgeId: chapter.badge.id,
            },
          },
        });

        if (!existingBadgeAward) {
          await tx.badgeAward.create({
            data: {
              childProfileId,
              badgeId: chapter.badge.id,
              awardedAt: now,
            },
          });
          newBadgeUnlocked = true;
        }
      }

      return {
        passed: true,
        score,
        maxScore: 4,
        xpEarned,
        isFirstCompletion,
        newBadgeUnlocked,
        badge: newBadgeUnlocked && chapter.badge ? chapter.badge.nameEn : null,
        progressRevision: updatedAttempt.progressRevision,
      };
    });
  }
}
