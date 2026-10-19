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
      let totalXp = c.rewards.reduce((acc, r) => acc + r.amount, 0);
      let completedCount = c.completions.length;
      let badgesCount = c.badgeAwards.length;

      // Also extract XP & stats from progressData JSON if available
      const prog = c.progressData as any;
      if (prog) {
        if (Array.isArray(prog.xp) && prog.xp.length > 0) {
          const jsonXp = prog.xp.reduce((acc: number, x: any) => acc + (Number(x?.amount) || 0), 0);
          totalXp = Math.max(totalXp, jsonXp);
        }
        if (prog.missions && typeof prog.missions === "object") {
          const count = Object.values(prog.missions).filter((m: any) => m?.status === "completed").length;
          completedCount = Math.max(completedCount, count);
        }
        if (Array.isArray(prog.badges) && prog.badges.length > 0) {
          badgesCount = Math.max(badgesCount, prog.badges.length);
        }
      }

      return {
        id: c.id,
        name: c.nickname,
        avatar: c.avatarKey || "lantern-noor",
        avatarUrl: c.avatarUrl || null,
        totalXp,
        stars: Math.floor(totalXp / 10),
        badgesCount,
        completedCount,
        standard: c.priorStandard && c.priorStandard !== "not-sure" && c.priorStandard !== "none"
          ? `Class ${c.priorStandard}`
          : "Class 3",
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
    password?: string;
    ageBand?: string;
    priorStandard?: string;
    avatarKey?: string;
    avatarUrl?: string | null;
    weeklyGoal?: number;
    progress?: any;
  }) {
    if (!dto.nickname?.trim() && !dto.email?.trim()) {
      return null;
    }

    let parent = await this.prisma.account.findFirst({
      where: { role: "PARENT" },
    });
    if (!parent) {
      parent = await this.prisma.account.findFirst();
    }
    // If no account exists in the database, auto-create a default system parent so student creation succeeds
    if (!parent) {
      parent = await this.prisma.account.create({
        data: {
          email: "system-parent@noorjourney.org",
          passwordHash: "system-managed-parent-placeholder",
          role: "PARENT",
        },
      });
    }

    const cleanEmail = dto.email?.trim().toLowerCase();
    const cleanNick = dto.nickname?.trim() || cleanEmail?.split("@")[0] || "Explorer";

    // Find by email or nickname
    let existing: any = null;
    if (cleanEmail) {
      existing = await this.prisma.childProfile.findFirst({
        where: {
          email: { equals: cleanEmail, mode: "insensitive" },
        },
      });
    }
    if (!existing && cleanNick) {
      existing = await this.prisma.childProfile.findFirst({
        where: {
          nickname: { equals: cleanNick, mode: "insensitive" },
        },
      });
    }

    if (existing) {
      return this.prisma.childProfile.update({
        where: { id: existing.id },
        data: {
          nickname: cleanNick,
          email: cleanEmail || existing.email,
          passwordHash: dto.password || existing.passwordHash,
          avatarUrl: dto.avatarUrl !== undefined ? dto.avatarUrl : existing.avatarUrl,
          avatarKey: dto.avatarKey || existing.avatarKey,
          ageBand: dto.ageBand || existing.ageBand,
          priorStandard: dto.priorStandard || existing.priorStandard,
          weeklyGoal: dto.weeklyGoal || existing.weeklyGoal,
          progressData: dto.progress ? (dto.progress as any) : existing.progressData,
        },
      });
    }

    return this.prisma.childProfile.create({
      data: {
        parentAccountId: parent.id,
        nickname: cleanNick,
        email: cleanEmail || null,
        passwordHash: dto.password || null,
        avatarKey: dto.avatarKey || "lantern-noor",
        avatarUrl: dto.avatarUrl || null,
        ageBand: dto.ageBand || "10-11",
        preferredLanguage: "en",
        priorStandard: dto.priorStandard || "4",
        weeklyGoal: dto.weeklyGoal || 3,
        progressData: dto.progress ? (dto.progress as any) : null,
      },
    });
  }

  async studentLogin(emailOrNick: string, password?: string) {
    const clean = (emailOrNick || "").trim();
    if (!clean) {
      return { success: false, error: "Please enter your email or nickname." };
    }

    const cleanEmail = clean.toLowerCase();

    const student = await this.prisma.childProfile.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: "insensitive" } },
          { nickname: { equals: clean, mode: "insensitive" } },
        ],
      },
    });

    if (!student) {
      return { success: false, error: "No student account found with this email." };
    }

    if (student.passwordHash && password && student.passwordHash !== password) {
      return { success: false, error: "Incorrect password. Please verify your password and try again." };
    }

    return {
      success: true,
      student: {
        id: student.id,
        nickname: student.nickname,
        email: student.email,
        ageBand: student.ageBand,
        priorStandard: student.priorStandard,
        avatarId: student.avatarKey,
        avatarUrl: student.avatarUrl,
        weeklyGoal: student.weeklyGoal,
        progress: student.progressData,
      },
    };
  }

  async syncProgress(data: {
    studentEmail?: string;
    profileId?: string;
    progress: any;
    avatarUrl?: string | null;
    avatarKey?: string;
  }) {
    let student: any = null;
    if (data.studentEmail) {
      student = await this.prisma.childProfile.findFirst({
        where: { email: { equals: data.studentEmail.trim(), mode: "insensitive" } },
      });
    }
    if (!student && data.profileId) {
      student = await this.prisma.childProfile.findUnique({
        where: { id: data.profileId },
      });
    }

    if (!student) {
      return { success: false, message: "Student profile not found." };
    }

    const updateData: any = {
      progressData: data.progress,
    };
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.avatarKey) updateData.avatarKey = data.avatarKey;

    await this.prisma.childProfile.update({
      where: { id: student.id },
      data: updateData,
    });

    return { success: true };
  }
}

