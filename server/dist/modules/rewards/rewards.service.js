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
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const clock_service_1 = require("../../common/clock/clock.service");
let RewardsService = class RewardsService {
    prisma;
    clock;
    constructor(prisma, clock) {
        this.prisma = prisma;
        this.clock = clock;
    }
    async getProgress(childProfileId) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childProfileId },
        });
        if (!child) {
            throw new common_1.NotFoundException({
                errorCode: "CHILD_NOT_FOUND",
                message: "Child profile not found.",
            });
        }
        const rewards = await this.prisma.rewardTransaction.findMany({
            where: { childProfileId },
            select: { amount: true },
        });
        const totalXp = rewards.reduce((sum, r) => sum + r.amount, 0);
        const completions = await this.prisma.missionCompletion.findMany({
            where: { childProfileId },
        });
        const completedCount = completions.length;
        const currentLevel = Math.max(1, 1 + Math.floor(completedCount / 2));
        const sevenDaysAgo = new Date(this.clock.now().getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentAttempts = await this.prisma.missionAttempt.findMany({
            where: {
                childProfileId,
                startedAt: { gte: sevenDaysAgo },
                status: "PASSED",
            },
            select: { startedAt: true },
        });
        const activeDays = new Set(recentAttempts.map((a) => a.startedAt.toISOString().slice(0, 10))).size;
        return {
            totalXp,
            currentLevel,
            completedMissionsCount: completedCount,
            weeklyGoal: child.weeklyGoal,
            weeklyCompletedSessions: recentAttempts.length,
            weeklyActiveDays: activeDays,
        };
    }
    async getCollection(childProfileId) {
        const allBadges = await this.prisma.badgeDefinition.findMany({
            include: { chapter: { select: { titleMl: true, titleEn: true } } },
        });
        const awardedBadges = await this.prisma.badgeAward.findMany({
            where: { childProfileId },
            select: { badgeId: true, awardedAt: true },
        });
        const awardedMap = new Map(awardedBadges.map((b) => [b.badgeId, b.awardedAt]));
        const badges = allBadges.map((b) => ({
            id: b.id,
            slug: b.slug,
            name: { ml: b.nameMl, en: b.nameEn },
            description: { ml: b.descriptionMl, en: b.descriptionEn },
            chapterTitle: { ml: b.chapter.titleMl, en: b.chapter.titleEn },
            earned: awardedMap.has(b.id),
            awardedAt: awardedMap.get(b.id) || null,
        }));
        const avatars = [
            { id: "lantern-noor", name: { ml: "നൂർ വിളക്ക്", en: "Noor Lantern" }, color: "#f59e0b", unlocked: true },
            { id: "olive-tree", name: { ml: "ഒലീവ് ഇല", en: "Olive Sprout" }, color: "#10b981", unlocked: true },
            { id: "crescent-star", name: { ml: "ചന്ദ്രക്കല", en: "Crescent Glow" }, color: "#06b6d4", unlocked: true },
            { id: "little-scholar", name: { ml: "കുഞ്ഞു പണ്ഡിതൻ", en: "Eager Reader" }, color: "#8b5cf6", unlocked: true },
            { id: "desert-falcon", name: { ml: "ധീര പരുന്ത്", en: "Brave Falcon" }, color: "#f97316", unlocked: true },
        ];
        return {
            badges,
            avatars,
        };
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clock_service_1.ClockService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map