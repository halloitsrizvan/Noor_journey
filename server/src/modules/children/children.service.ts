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
}
