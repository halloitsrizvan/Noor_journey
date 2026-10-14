import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { ClockService } from "@/common/clock/clock.service";

@Injectable()
export class ParentReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: ClockService,
  ) {}

  async getChildSummary(childProfileId: string) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childProfileId },
      include: {
        parentAccount: { select: { email: true } },
      },
    });

    if (!child) {
      throw new NotFoundException({
        errorCode: "CHILD_NOT_FOUND",
        message: "Child profile not found.",
      });
    }

    const now = this.clock.now();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Completed missions & concepts
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

    // 2. Due revisions
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

    // 3. Weekly sessions & active days
    const recentAttempts = await this.prisma.missionAttempt.findMany({
      where: {
        childProfileId,
        startedAt: { gte: sevenDaysAgo },
        status: "PASSED",
      },
      select: { startedAt: true },
    });

    const activeDaysSet = new Set(
      recentAttempts.map((a) => a.startedAt.toISOString().slice(0, 10))
    );

    // 4. Rewards
    const rewards = await this.prisma.rewardTransaction.findMany({
      where: { childProfileId },
      select: { amount: true },
    });
    const totalXp = rewards.reduce((sum, r) => sum + r.amount, 0);

    // 5. Badges
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
}
