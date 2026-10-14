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
exports.ParentReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const clock_service_1 = require("../../common/clock/clock.service");
let ParentReportsService = class ParentReportsService {
    prisma;
    clock;
    constructor(prisma, clock) {
        this.prisma = prisma;
        this.clock = clock;
    }
    async getChildSummary(childProfileId) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childProfileId },
            include: {
                parentAccount: { select: { email: true } },
            },
        });
        if (!child) {
            throw new common_1.NotFoundException({
                errorCode: "CHILD_NOT_FOUND",
                message: "Child profile not found.",
            });
        }
        const now = this.clock.now();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const completions = await this.prisma.missionCompletion.findMany({
            where: { childProfileId },
            include: {
                mission: {
                    select: {
                        id: true,
                        titleMl: true,
                        titleEn: true,
                        conceptMl: true,
                        conceptEn: true,
                        order: true,
                    },
                },
            },
        });
        const dueReviews = await this.prisma.reviewSchedule.findMany({
            where: {
                childProfileId,
                retained: false,
                dueAt: { lte: now },
            },
            include: {
                mission: {
                    select: {
                        id: true,
                        titleMl: true,
                        titleEn: true,
                        conceptMl: true,
                        conceptEn: true,
                    },
                },
            },
        });
        const recentAttempts = await this.prisma.missionAttempt.findMany({
            where: {
                childProfileId,
                startedAt: { gte: sevenDaysAgo },
                status: "PASSED",
            },
            select: { startedAt: true },
        });
        const activeDaysSet = new Set(recentAttempts.map((a) => a.startedAt.toISOString().slice(0, 10)));
        const rewards = await this.prisma.rewardTransaction.findMany({
            where: { childProfileId },
            select: { amount: true },
        });
        const totalXp = rewards.reduce((sum, r) => sum + r.amount, 0);
        const badgeAwards = await this.prisma.badgeAward.findMany({
            where: { childProfileId },
            include: { badge: true },
        });
        return {
            child: {
                id: child.id,
                nickname: child.nickname,
                ageBand: child.ageBand,
                preferredLanguage: child.preferredLanguage,
                weeklyGoal: child.weeklyGoal,
                timezone: child.timezone,
            },
            stats: {
                totalXp,
                completedCount: completions.length,
                weeklyCompletedSessions: recentAttempts.length,
                weeklyActiveDays: activeDaysSet.size,
                weeklyGoal: child.weeklyGoal,
            },
            masteredConcepts: completions.map((c) => ({
                missionId: c.mission.id,
                title: { ml: c.mission.titleMl, en: c.mission.titleEn },
                concept: { ml: c.mission.conceptMl, en: c.mission.conceptEn },
                completedAt: c.firstCompletedAt,
            })),
            dueRevisions: dueReviews.map((r) => ({
                missionId: r.mission.id,
                title: { ml: r.mission.titleMl, en: r.mission.titleEn },
                concept: { ml: r.mission.conceptMl, en: r.mission.conceptEn },
                stage: r.stage,
                dueAt: r.dueAt,
            })),
            badges: badgeAwards.map((b) => ({
                slug: b.badge.slug,
                name: { ml: b.badge.nameMl, en: b.badge.nameEn },
                awardedAt: b.awardedAt,
            })),
        };
    }
};
exports.ParentReportsService = ParentReportsService;
exports.ParentReportsService = ParentReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clock_service_1.ClockService])
], ParentReportsService);
//# sourceMappingURL=parent-reports.service.js.map