"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const clock_service_1 = require("../../common/clock/clock.service");
const client_1 = require("@prisma/client");
let AttemptsService = class AttemptsService {
    prisma;
    clock;
    constructor(prisma, clock) {
        this.prisma = prisma;
        this.clock = clock;
    }
    async createAttempt(childProfileId, missionId, versionId) {
        let missionVersionId = versionId;
        if (!missionVersionId) {
            const mission = await this.prisma.mission.findUnique({
                where: { id: missionId },
                include: {
                    versions: {
                        where: { publishState: client_1.PublishState.PUBLISHED },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            });
            if (!mission || !mission.versions[0]) {
                throw new common_1.NotFoundException({
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
                status: client_1.AttemptStatus.IN_PROGRESS,
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
    async getAttempt(attemptId) {
        const attempt = await this.prisma.missionAttempt.findUnique({
            where: { id: attemptId },
            include: {
                submissions: true,
                checkpoints: true,
            },
        });
        if (!attempt) {
            throw new common_1.NotFoundException({
                errorCode: "ATTEMPT_NOT_FOUND",
                message: "Attempt not found.",
            });
        }
        return attempt;
    }
    async submitActivity(attemptId, activityId, payload) {
        const attempt = await this.prisma.missionAttempt.findUnique({
            where: { id: attemptId },
            include: { missionVersion: true },
        });
        if (!attempt || attempt.status !== client_1.AttemptStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException({
                errorCode: "ATTEMPT_INVALID",
                message: "Attempt is not active.",
            });
        }
        const activities = attempt.missionVersion.activitiesJson;
        const activity = activities.find((a) => a.id === activityId);
        if (!activity) {
            throw new common_1.NotFoundException({
                errorCode: "ACTIVITY_NOT_FOUND",
                message: "Activity not found in this mission.",
            });
        }
        let isCorrect = false;
        let feedbackMl = activity.explainWrong?.ml || "ഒന്നുകൂടി ചിന്തിക്കാം.";
        let feedbackEn = activity.explainWrong?.en || "Let's review this together.";
        if (activity.kind === "choice") {
            isCorrect = payload === activity.correctId || payload?.choiceId === activity.correctId;
        }
        else if (activity.kind === "match") {
            const requiredPairIds = (activity.pairs || []).map((p) => p.id);
            const submittedIds = Array.isArray(payload) ? payload : payload?.pairs || [];
            isCorrect = requiredPairIds.every((id) => submittedIds.includes(id));
        }
        else if (activity.kind === "sequence") {
            const correctOrder = (activity.steps || []).map((s) => s.id);
            const submittedOrder = Array.isArray(payload) ? payload : payload?.steps || [];
            isCorrect =
                correctOrder.length === submittedOrder.length &&
                    correctOrder.every((id, i) => id === submittedOrder[i]);
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
    async createCheckpoint(attemptId) {
        const attempt = await this.prisma.missionAttempt.findUnique({
            where: { id: attemptId },
        });
        if (!attempt || attempt.status !== client_1.AttemptStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException({
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
    async submitCheckpointAnswer(checkpointId, questionId, choiceId) {
        const checkpoint = await this.prisma.checkpointAttempt.findUnique({
            where: { id: checkpointId },
            include: {
                attempt: {
                    include: { missionVersion: true },
                },
            },
        });
        if (!checkpoint) {
            throw new common_1.NotFoundException({
                errorCode: "CHECKPOINT_NOT_FOUND",
                message: "Checkpoint attempt not found.",
            });
        }
        const pool = checkpoint.attempt.missionVersion.checkpointPoolJson;
        const question = pool.find((q) => q.id === questionId);
        if (!question) {
            throw new common_1.NotFoundException({
                errorCode: "QUESTION_NOT_FOUND",
                message: "Question not found in checkpoint pool.",
            });
        }
        const isCorrect = choiceId === question.correctId;
        const feedback = isCorrect ? question.explainCorrect : question.explainWrong;
        const existingAnswers = checkpoint.answersJson || [];
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
    async finalizeCheckpoint(childProfileId, checkpointId, idempotencyKey) {
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
            throw new common_1.NotFoundException({
                errorCode: "CHECKPOINT_NOT_FOUND",
                message: "Checkpoint not found.",
            });
        }
        const mission = checkpoint.attempt.missionVersion.mission;
        const missionId = mission.id;
        const chapter = mission.learningChapter;
        const effectiveKey = idempotencyKey || `finalize-checkpoint-${checkpointId}`;
        const existingReward = await this.prisma.rewardTransaction.findUnique({
            where: { idempotencyKey: effectiveKey },
        });
        const answers = checkpoint.answersJson || [];
        const score = answers.filter((a) => a.isCorrect).length;
        const passed = score >= 3;
        const now = this.clock.now();
        return this.prisma.$transaction(async (tx) => {
            await tx.checkpointAttempt.update({
                where: { id: checkpointId },
                data: {
                    score,
                    passed,
                    passedAt: passed ? now : null,
                },
            });
            const updatedAttempt = await tx.missionAttempt.update({
                where: { id: checkpoint.attemptId },
                data: {
                    status: passed ? client_1.AttemptStatus.PASSED : client_1.AttemptStatus.FAILED,
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
                if (!existingReward) {
                    await tx.rewardTransaction.create({
                        data: {
                            idempotencyKey: effectiveKey,
                            childProfileId,
                            amount: 20,
                            reason: client_1.RewardReason.MISSION_COMPLETION,
                            referenceId: missionId,
                            createdAt: now,
                        },
                    });
                }
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
            }
            else {
                await tx.missionCompletion.update({
                    where: { id: existingCompletion.id },
                    data: { completedCount: { increment: 1 } },
                });
            }
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
};
exports.AttemptsService = AttemptsService;
exports.AttemptsService = AttemptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clock_service_1.ClockService])
], AttemptsService);
//# sourceMappingURL=attempts.service.js.map