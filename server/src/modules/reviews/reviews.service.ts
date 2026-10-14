import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { ClockService } from "@/common/clock/clock.service";
import { MasteryState, PublishState, RewardReason } from "@prisma/client";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: ClockService,
  ) {}

  async getDueReviews(childProfileId: string) {
    const now = this.clock.now();

    const dueSchedules = await this.prisma.reviewSchedule.findMany({
      where: {
        childProfileId,
        retained: false,
        dueAt: { lte: now },
      },
      include: {
        mission: {
          include: {
            versions: {
              where: { publishState: PublishState.PUBLISHED },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    return dueSchedules.map((schedule) => {
      const activeVersion = schedule.mission.versions[0];
      const revisionQuestions = activeVersion ? (activeVersion.revisionJson as any[]) : [];

      // Strip private answer keys!
      const sanitizedQuestions = (Array.isArray(revisionQuestions) ? revisionQuestions : []).map((q) => {
        const { correctId, explainCorrect, explainWrong, ...safe } = q;
        return safe;
      });

      return {
        id: schedule.id,
        missionId: schedule.missionId,
        stage: schedule.stage,
        dueAt: schedule.dueAt,
        missionTitle: { ml: schedule.mission.titleMl, en: schedule.mission.titleEn },
        concept: { ml: schedule.mission.conceptMl, en: schedule.mission.conceptEn },
        questions: sanitizedQuestions,
      };
    });
  }

  async createReviewAttempt(childProfileId: string, reviewScheduleId: string) {
    const schedule = await this.prisma.reviewSchedule.findUnique({
      where: { id: reviewScheduleId },
    });

    if (!schedule || schedule.childProfileId !== childProfileId) {
      throw new NotFoundException({
        errorCode: "REVIEW_SCHEDULE_NOT_FOUND",
        message: "Review schedule not found.",
      });
    }

    return this.prisma.reviewAttempt.create({
      data: {
        reviewScheduleId,
        childProfileId,
        missionId: schedule.missionId,
        answersJson: [],
        passed: false,
        passedAt: this.clock.now(),
      },
    });
  }

  async submitReviewAnswers(
    attemptId: string,
    answers: { questionId: string; choiceId: string }[],
  ) {
    const attempt = await this.prisma.reviewAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException({
        errorCode: "ATTEMPT_NOT_FOUND",
        message: "Review attempt not found.",
      });
    }

    return this.prisma.reviewAttempt.update({
      where: { id: attemptId },
      data: { answersJson: answers },
    });
  }

  async finalizeReview(
    childProfileId: string,
    attemptId: string,
    idempotencyKey?: string,
  ) {
    const attempt = await this.prisma.reviewAttempt.findUnique({
      where: { id: attemptId },
      include: {
        reviewSchedule: {
          include: {
            mission: {
              include: {
                versions: {
                  where: { publishState: PublishState.PUBLISHED },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException({
        errorCode: "ATTEMPT_NOT_FOUND",
        message: "Review attempt not found.",
      });
    }

    const schedule = attempt.reviewSchedule;
    const activeVersion = schedule.mission.versions[0];
    const revisionQuestions = activeVersion ? (activeVersion.revisionJson as any[]) : [];

    // Grade answers
    const submittedAnswers = (attempt.answersJson as any[]) || [];
    let correctCount = 0;

    for (const ans of submittedAnswers) {
      const q = revisionQuestions.find((rq: any) => rq.id === ans.questionId);
      if (q && q.correctId === ans.choiceId) {
        correctCount++;
      }
    }

    const passed = correctCount === revisionQuestions.length || correctCount >= 1;
    const now = this.clock.now();
    const dedupeKey =
      idempotencyKey ||
      `review-reward-${childProfileId}-${schedule.missionId}-stage-${schedule.stage}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update attempt
      await tx.reviewAttempt.update({
        where: { id: attemptId },
        data: { passed, passedAt: now },
      });

      if (!passed) {
        return {
          passed: false,
          xpEarned: 0,
          retained: false,
          nextDueAt: schedule.dueAt,
          message: "Review not passed. Spaced schedule kept active for retry.",
        };
      }

      // 2. Advance stage or mark retained
      let nextStage = schedule.stage + 1;
      let nextDueAt = now;
      let isRetained = false;

      if (nextStage === 1) {
        nextDueAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
      } else if (nextStage === 2) {
        nextDueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
      } else {
        isRetained = true;
      }

      await tx.reviewSchedule.update({
        where: { id: schedule.id },
        data: {
          stage: nextStage,
          dueAt: nextDueAt,
          retained: isRetained,
          lastReviewedAt: now,
        },
      });

      // Update ObjectiveMastery if retained
      if (isRetained) {
        const mappings = await tx.missionObjectiveMapping.findMany({
          where: { missionVersionId: activeVersion.id },
        });

        for (const map of mappings) {
          await tx.objectiveMastery.upsert({
            where: {
              childProfileId_objectiveId: {
                childProfileId,
                objectiveId: map.objectiveId,
              },
            },
            update: { state: MasteryState.RETAINED },
            create: {
              childProfileId,
              objectiveId: map.objectiveId,
              state: MasteryState.RETAINED,
            },
          });
        }
      }

      // 3. Award 5 XP once
      const existingReward = await tx.rewardTransaction.findUnique({
        where: { idempotencyKey: dedupeKey },
      });

      let xpEarned = 0;
      if (!existingReward) {
        xpEarned = 5;
        await tx.rewardTransaction.create({
          data: {
            idempotencyKey: dedupeKey,
            childProfileId,
            amount: 5,
            reason: RewardReason.SCHEDULED_REVIEW,
            referenceId: schedule.missionId,
            createdAt: now,
          },
        });
      }

      return {
        passed: true,
        xpEarned,
        retained: isRetained,
        nextStage,
        nextDueAt,
      };
    });
  }
}
