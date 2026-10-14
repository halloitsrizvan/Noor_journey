import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { ClockService } from "@/common/clock/clock.service";

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: ClockService,
  ) {}

  async getProgress(childProfileId: string) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childProfileId },
    });

    if (!child) {
      throw new NotFoundException({
        errorCode: "CHILD_NOT_FOUND",
        message: "Child profile not found.",
      });
    }

    // 1. Total XP
    const rewards = await this.prisma.rewardTransaction.findMany({
      where: { childProfileId },
      select: { amount: true },
    });
    const totalXp = rewards.reduce((sum, r) => sum + r.amount, 0);

    // 2. Completed Missions
    const completions = await this.prisma.missionCompletion.findMany({
      where: { childProfileId },
    });
    const completedCount = completions.length;

    // 3. Level summarizes completed chapters / missions
    const currentLevel = Math.max(1, 1 + Math.floor(completedCount / 2));

    // 4. Weekly progress: distinct active sessions in past 7 days
    const sevenDaysAgo = new Date(this.clock.now().getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = await this.prisma.missionAttempt.findMany({
      where: {
        childProfileId,
        startedAt: { gte: sevenDaysAgo },
        status: "PASSED",
      },
      select: { startedAt: true },
    });

    const activeDays = new Set(
      recentAttempts.map((a) => a.startedAt.toISOString().slice(0, 10))
    ).size;

    return {
      totalXp,
      currentLevel,
      completedMissionsCount: completedCount,
      weeklyGoal: child.weeklyGoal,
      weeklyCompletedSessions: recentAttempts.length,
      weeklyActiveDays: activeDays,
    };
  }

  async getCollection(childProfileId: string) {
    // 1. Badges
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

    // 2. Avatar Cosmetics
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
}
