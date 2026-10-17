import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { ClockService } from "@/common/clock/clock.service";
import { PublishState, ReviewStatus } from "@prisma/client";
import { CreateDraftDto, ReviewContentDto, PublishVersionDto } from "./dto/editorial.dto";

@Injectable()
export class EditorialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: ClockService,
  ) {}

  async createDraft(authorId: string, missionId: string, dto: CreateDraftDto) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException({
        errorCode: "MISSION_NOT_FOUND",
        message: "Mission not found.",
      });
    }

    return this.prisma.missionVersion.create({
      data: {
        missionId,
        versionString: dto.versionString,
        publishState: PublishState.DRAFT,
        reviewStatus: ReviewStatus.AWAITING_REVIEW,
        teachingJson: dto.teachingJson,
        activitiesJson: dto.activitiesJson,
        checkpointPoolJson: dto.checkpointPoolJson,
        revisionJson: dto.revisionJson,
        familyPromptMl: dto.familyPromptMl,
        familyPromptEn: dto.familyPromptEn,
        createdAt: this.clock.now(),
      },
    });
  }

  async submitDraft(authorId: string, versionId: string) {
    const version = await this.prisma.missionVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.publishState !== PublishState.DRAFT) {
      throw new BadRequestException({
        errorCode: "VERSION_NOT_IN_DRAFT",
        message: "Only draft versions can be submitted for review.",
      });
    }

    return this.prisma.missionVersion.update({
      where: { id: versionId },
      data: {
        publishState: PublishState.SUBMITTED,
        reviewStatus: ReviewStatus.IN_REVIEW,
      },
    });
  }

  async reviewContent(reviewerId: string, versionId: string, dto: ReviewContentDto) {
    const version = await this.prisma.missionVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      throw new NotFoundException({
        errorCode: "VERSION_NOT_FOUND",
        message: "Mission version not found.",
      });
    }

    // Explicit PRD Rule: Author cannot approve their own content!
    if (version.approvedById === reviewerId) {
      throw new ForbiddenException({
        errorCode: "AUTHOR_CANNOT_APPROVE_OWN_CONTENT",
        message: "Authors cannot review or approve their own content.",
      });
    }

    const newReviewStatus =
      dto.status === "APPROVED" ? ReviewStatus.APPROVED : ReviewStatus.REJECTED;

    return this.prisma.$transaction(async (tx) => {
      await tx.contentReview.create({
        data: {
          missionVersionId: versionId,
          reviewerId,
          status: newReviewStatus,
          comments: dto.comments,
          createdAt: this.clock.now(),
        },
      });

      return tx.missionVersion.update({
        where: { id: versionId },
        data: {
          reviewStatus: newReviewStatus,
          approvedById: dto.status === "APPROVED" ? reviewerId : null,
          approvedAt: dto.status === "APPROVED" ? this.clock.now() : null,
        },
      });
    });
  }

  async publishVersion(publisherId: string, versionId: string, dto?: PublishVersionDto) {
    const version = await this.prisma.missionVersion.findUnique({
      where: { id: versionId },
      include: {
        objectiveMappings: true,
        reviews: true,
      },
    });

    if (!version) {
      throw new NotFoundException({
        errorCode: "VERSION_NOT_FOUND",
        message: "Mission version not found.",
      });
    }

    // Rule: Must be approved by a reviewer
    if (version.reviewStatus !== ReviewStatus.APPROVED) {
      throw new BadRequestException({
        errorCode: "CONTENT_NOT_APPROVED",
        message: "Content must be formally approved before publication.",
      });
    }

    // Rule: Production publication requires verified curriculum mapping
    if (version.objectiveMappings.length === 0 && !version.supplementary) {
      throw new BadRequestException({
        errorCode: "MAPPING_REQUIRED",
        message: "Production publication requires verified curriculum objective mapping.",
      });
    }

    const now = this.clock.now();

    return this.prisma.$transaction(async (tx) => {
      // 1. Archive any previously published version for the same mission
      await tx.missionVersion.updateMany({
        where: {
          missionId: version.missionId,
          publishState: PublishState.PUBLISHED,
        },
        data: {
          publishState: PublishState.ARCHIVED,
        },
      });

      // 2. Publish this version
      const published = await tx.missionVersion.update({
        where: { id: versionId },
        data: {
          publishState: PublishState.PUBLISHED,
          publishedAt: now,
        },
      });

      // 3. Record publication audit
      await tx.publicationRecord.create({
        data: {
          missionVersionId: versionId,
          publishedById: publisherId,
          publishedAt: now,
          releaseNotes: dto?.releaseNotes,
        },
      });

      return published;
    });
  }

  async archiveVersion(versionId: string) {
    return this.prisma.missionVersion.update({
      where: { id: versionId },
      data: { publishState: PublishState.ARCHIVED },
    });
  }

  async withdrawVersion(versionId: string) {
    return this.prisma.missionVersion.update({
      where: { id: versionId },
      data: {
        publishState: PublishState.ARCHIVED,
        reviewStatus: ReviewStatus.REJECTED,
      },
    });
  }

  async getEditorialOverview() {
    const [accounts, children, versions, missions, attempts] = await Promise.all([
      this.prisma.account.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { children: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.childProfile.findMany({
        include: {
          parentAccount: { select: { email: true } },
          _count: { select: { attempts: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.missionVersion.findMany({
        include: {
          mission: {
            include: { learningChapter: { include: { world: true } } },
          },
          reviews: {
            include: { reviewer: { select: { email: true } } },
          },
          publications: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.mission.findMany({
        include: {
          learningChapter: { include: { world: true } },
          versions: true,
        },
      }),
      this.prisma.missionAttempt.count(),
    ]);

    const stats = {
      totalAccounts: accounts.length,
      totalParents: accounts.filter((a) => a.role === "PARENT").length,
      totalAdmins: accounts.filter((a) => a.role === "ADMIN").length,
      totalChildren: children.length,
      totalMissions: missions.length,
      totalVersions: versions.length,
      publishedVersions: versions.filter((v) => v.publishState === "PUBLISHED").length,
      reviewPendingVersions: versions.filter((v) => v.publishState === "SUBMITTED" || v.reviewStatus === "AWAITING_REVIEW").length,
      totalAttempts: attempts,
    };

    return {
      stats,
      versions,
      accounts,
      children,
    };
  }
}
