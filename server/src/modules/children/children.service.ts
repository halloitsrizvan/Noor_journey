import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateChildProfileDto, UpdateChildProfileDto } from "./dto/children.dto";

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  async getChildren(parentAccountId: string) {
    return this.prisma.childProfile.findMany({
      where: { parentAccountId },
      orderBy: { createdAt: "asc" },
      include: {
        completions: {
          select: { missionId: true, firstCompletedAt: true },
        },
        badgeAwards: {
          select: { badgeId: true, awardedAt: true },
        },
      },
    });
  }

  async getChild(parentAccountId: string, childId: string) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        completions: true,
        badgeAwards: true,
      },
    });

    if (!child) {
      throw new NotFoundException({
        errorCode: "CHILD_NOT_FOUND",
        message: "Child profile not found.",
      });
    }

    if (child.parentAccountId !== parentAccountId) {
      throw new ForbiddenException({
        errorCode: "CHILD_NOT_OWNED",
        message: "You do not have permission to view this child profile.",
      });
    }

    return child;
  }

  async createChild(parentAccountId: string, dto: CreateChildProfileDto) {
    return this.prisma.childProfile.create({
      data: {
        parentAccountId,
        nickname: dto.nickname.trim(),
        ageBand: dto.ageBand,
        preferredLanguage: dto.preferredLanguage || "ml",
        priorStandard: dto.priorStandard || null,
        avatarKey: dto.avatarKey || "lantern-noor",
        weeklyGoal: dto.weeklyGoal || 3,
      },
    });
  }

  async updateChild(parentAccountId: string, childId: string, dto: UpdateChildProfileDto) {
    await this.getChild(parentAccountId, childId);

    return this.prisma.childProfile.update({
      where: { id: childId },
      data: {
        nickname: dto.nickname ? dto.nickname.trim() : undefined,
        ageBand: dto.ageBand,
        preferredLanguage: dto.preferredLanguage,
        priorStandard: dto.priorStandard,
        weeklyGoal: dto.weeklyGoal,
      },
    });
  }

  async deleteChild(parentAccountId: string, childId: string) {
    await this.getChild(parentAccountId, childId);

    await this.prisma.childProfile.delete({
      where: { id: childId },
    });

    return { success: true, message: "Child profile deleted successfully." };
  }

  async updateAvatar(parentAccountId: string, childId: string, avatarKey: string) {
    await this.getChild(parentAccountId, childId);

    return this.prisma.childProfile.update({
      where: { id: childId },
      data: { avatarKey },
    });
  }

  async getLeaderboard() {
    const children = await this.prisma.childProfile.findMany({
      include: {
        rewards: {
          select: { amount: true },
        },
        badgeAwards: {
          select: { id: true },
        },
        completions: {
          select: { id: true },
        },
      },
    });

    const entries = children.map((c) => {
      const totalXp = c.rewards.reduce((acc, r) => acc + r.amount, 0);
      return {
        id: c.id,
        name: c.nickname,
        avatar: c.avatarKey || "lantern-noor",
        totalXp,
        stars: Math.floor(totalXp / 10),
        badgesCount: c.badgeAwards.length,
        completedCount: c.completions.length,
        createdAt: c.createdAt,
      };
    });

    entries.sort((a, b) => b.totalXp - a.totalXp || b.completedCount - a.completedCount);

    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  async syncStudent(dto: {
    nickname: string;
    email?: string;
    ageBand?: string;
    priorStandard?: string;
    avatarKey?: string;
    weeklyGoal?: number;
  }) {
    if (!dto.nickname?.trim()) {
      return null;
    }

    let parent = await this.prisma.account.findFirst({
      where: { role: "PARENT" },
    });
    if (!parent) {
      parent = await this.prisma.account.findFirst();
    }
    if (!parent) {
      return null;
    }

    const cleanNick = dto.nickname.trim();
    const existing = await this.prisma.childProfile.findFirst({
      where: {
        nickname: { equals: cleanNick, mode: "insensitive" },
      },
    });

    if (existing) {
      return this.prisma.childProfile.update({
        where: { id: existing.id },
        data: {
          ageBand: dto.ageBand || existing.ageBand,
          priorStandard: dto.priorStandard || existing.priorStandard,
          avatarKey: dto.avatarKey || existing.avatarKey,
          weeklyGoal: dto.weeklyGoal || existing.weeklyGoal,
        },
      });
    }

    return this.prisma.childProfile.create({
      data: {
        parentAccountId: parent.id,
        nickname: cleanNick,
        ageBand: dto.ageBand || "10-11",
        preferredLanguage: "en",
        priorStandard: dto.priorStandard || "4",
        avatarKey: dto.avatarKey || "lantern-noor",
        weeklyGoal: dto.weeklyGoal || 3,
      },
    });
  }
}

