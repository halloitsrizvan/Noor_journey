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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const clock_service_1 = require("../../common/clock/clock.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    prisma;
    clock;
    constructor(prisma, clock) {
        this.prisma = prisma;
        this.clock = clock;
    }
    async getDueReviews(childProfileId) {
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
                            where: { publishState: client_1.PublishState.PUBLISHED },
                            orderBy: { createdAt: "desc" },
                            take: 1,
                        },
                    },
                },
            },
        });
        return dueSchedules.map((schedule) => {
            const activeVersion = schedule.mission.versions[0];
            const revisionQuestions = activeVersion ? activeVersion.revisionJson : [];
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
    async createReviewAttempt(childProfileId, reviewScheduleId) {
        const schedule = await this.prisma.reviewSchedule.findUnique({
            where: { id: reviewScheduleId },
        });
        if (!schedule || schedule.childProfileId !== childProfileId) {
            throw new common_1.NotFoundException({
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
    async submitReviewAnswers(attemptId, answers) {
        const attempt = await this.prisma.reviewAttempt.findUnique({
            where: { id: attemptId },
        });
        if (!attempt) {
            throw new common_1.NotFoundException({
                errorCode: "ATTEMPT_NOT_FOUND",
                message: "Review attempt not found.",
            });
        }
        return this.prisma.reviewAttempt.update({
            where: { id: attemptId },
            data: { answersJson: answers },
        });
    }
    async finalizeReview(childProfileId, attemptId, idempotencyKey) {
        const attempt = await this.prisma.reviewAttempt.findUnique({
            where: { id: attemptId },
            include: {
                reviewSchedule: {
                    include: {
                        mission: {
                            include: {
                                versions: {
                                    where: { publishState: client_1.PublishState.PUBLISHED },
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
            throw new common_1.NotFoundException({
                errorCode: "ATTEMPT_NOT_FOUND",
                message: "Review attempt not found.",
            });
        }
        const schedule = attempt.reviewSchedule;
        const activeVersion = schedule.mission.versions[0];
        const revisionQuestions = activeVersion ? activeVersion.revisionJson : [];
        const submittedAnswers = attempt.answersJson || [];
        let correctCount = 0;
        for (const ans of submittedAnswers) {
            const q = revisionQuestions.find((rq) => rq.id === ans.questionId);
            if (q && q.correctId === ans.choiceId) {
                correctCount++;
            }
        }
        const passed = correctCount === revisionQuestions.length || correctCount >= 1;
        const now = this.clock.now();
        const dedupeKey = idempotencyKey ||
            `review-reward-${childProfileId}-${schedule.missionId}-stage-${schedule.stage}`;
        return this.prisma.$transaction(async (tx) => {
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
            let nextStage = schedule.stage + 1;
            let nextDueAt = now;
            let isRetained = false;
            if (nextStage === 1) {
                nextDueAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            }
            else if (nextStage === 2) {
                nextDueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            }
            else {
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
                        update: { state: client_1.MasteryState.RETAINED },
                        create: {
                            childProfileId,
                            objectiveId: map.objectiveId,
                            state: client_1.MasteryState.RETAINED,
                        },
                    });
                }
            }
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
                        reason: client_1.RewardReason.SCHEDULED_REVIEW,
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clock_service_1.ClockService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map