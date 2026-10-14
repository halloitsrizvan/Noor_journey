import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { PublishState } from "@prisma/client";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorlds() {
    return this.prisma.world.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        chapters: {
          where: { playable: true },
          select: { id: true, slug: true, titleMl: true, titleEn: true },
        },
      },
    });
  }

  async getSubjects() {
    return [
      { id: "taskiya-akhlaq", nameMl: "തസ്കിയത്ത് & അഖ്ലാഖ്", nameEn: "Taskiya & Akhlaq" },
      { id: "aqaid", nameMl: "അഖാഇദ്", nameEn: "Aqaid" },
      { id: "fiqh", nameMl: "ഫിഖ്ഹ്", nameEn: "Fiqh" },
      { id: "thariq", nameMl: "താരീഖ്", nameEn: "Thariq" },
      { id: "quran-studies", nameMl: "ഖുർആൻ പഠനം", nameEn: "Quran Studies" },
      { id: "language-script", nameMl: "ഭാഷയും ലിപിയും", nameEn: "Language & Script" },
      { id: "nahv-saraf", nameMl: "നഹ്വും സ്വറഫും", nameEn: "Nahv & Saraf" },
    ];
  }

  async getChildJourney(childProfileId: string) {
    const completions = await this.prisma.missionCompletion.findMany({
      where: { childProfileId },
      select: { missionId: true },
    });
    const completedSet = new Set(completions.map((c) => c.missionId));

    // Get Akhlaq chapter
    const chapter = await this.prisma.learningChapter.findFirst({
      where: { slug: "akhlaq-small-actions" },
      include: {
        world: true,
        missions: {
          orderBy: { order: "asc" },
          include: {
            prerequisites: true,
            versions: {
              where: { publishState: PublishState.PUBLISHED },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        badge: true,
      },
    });

    if (!chapter) {
      throw new NotFoundException({
        errorCode: "CHAPTER_NOT_FOUND",
        message: "Learning chapter not found.",
      });
    }

    let foundCurrent = false;

    const missionsWithStatus = chapter.missions.map((mission) => {
      const isCompleted = completedSet.has(mission.id);

      let status: "completed" | "current" | "available" | "locked" = "locked";

      if (isCompleted) {
        status = "completed";
      } else {
        // Check prerequisites
        const prereqsMet = mission.prerequisites.every((p) =>
          completedSet.has(p.prerequisiteMissionId)
        );

        if (prereqsMet) {
          if (!foundCurrent) {
            status = "current";
            foundCurrent = true;
          } else {
            status = "available";
          }
        } else {
          status = "locked";
        }
      }

      const activeVersion = mission.versions[0];

      return {
        id: mission.id,
        slug: mission.slug,
        order: mission.order,
        title: { ml: mission.titleMl, en: mission.titleEn },
        concept: { ml: mission.conceptMl, en: mission.conceptEn },
        objective: { ml: mission.objectiveMl, en: mission.objectiveEn },
        minutes: mission.minutes,
        subjectId: mission.subjectId,
        status,
        version: activeVersion ? activeVersion.versionString : "1.0.0",
      };
    });

    return {
      world: {
        id: chapter.world.id,
        slug: chapter.world.slug,
        title: { ml: chapter.world.titleMl, en: chapter.world.titleEn },
      },
      chapter: {
        id: chapter.id,
        slug: chapter.slug,
        title: { ml: chapter.titleMl, en: chapter.titleEn },
        description: { ml: chapter.descriptionMl, en: chapter.descriptionEn },
        badge: chapter.badge
          ? {
              id: chapter.badge.id,
              slug: chapter.badge.slug,
              name: { ml: chapter.badge.nameMl, en: chapter.badge.nameEn },
            }
          : null,
      },
      missions: missionsWithStatus,
    };
  }

  async getChildChapter(childProfileId: string, chapterId: string) {
    const chapter = await this.prisma.learningChapter.findUnique({
      where: { id: chapterId },
      include: {
        badge: true,
        missions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException({
        errorCode: "CHAPTER_NOT_FOUND",
        message: "Chapter not found.",
      });
    }

    const completions = await this.prisma.missionCompletion.findMany({
      where: { childProfileId },
      select: { missionId: true },
    });
    const completedSet = new Set(completions.map((c) => c.missionId));

    return {
      id: chapter.id,
      slug: chapter.slug,
      title: { ml: chapter.titleMl, en: chapter.titleEn },
      description: { ml: chapter.descriptionMl, en: chapter.descriptionEn },
      badge: chapter.badge,
      totalMissions: chapter.missions.length,
      completedMissions: chapter.missions.filter((m) => completedSet.has(m.id)).length,
    };
  }

  async getChildMission(childProfileId: string, missionId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        prerequisites: true,
        versions: {
          where: { publishState: PublishState.PUBLISHED },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!mission) {
      throw new NotFoundException({
        errorCode: "MISSION_NOT_FOUND",
        message: "Mission not found.",
      });
    }

    // Check prerequisites
    const completions = await this.prisma.missionCompletion.findMany({
      where: { childProfileId },
      select: { missionId: true },
    });
    const completedSet = new Set(completions.map((c) => c.missionId));

    const prereqsMet = mission.prerequisites.every((p) =>
      completedSet.has(p.prerequisiteMissionId)
    );

    if (!prereqsMet && !completedSet.has(mission.id)) {
      throw new ForbiddenException({
        errorCode: "MISSION_LOCKED",
        message: "Complete the previous mission first.",
      });
    }

    const version = mission.versions[0];
    if (!version) {
      throw new NotFoundException({
        errorCode: "MISSION_VERSION_UNAVAILABLE",
        message: "Published version for this mission is not currently available.",
      });
    }

    // Sanitize checkpoint pool: remove private answer keys!
    const pool = version.checkpointPoolJson as any[];
    const sanitizedCheckpointPool = (Array.isArray(pool) ? pool : []).map((q) => {
      const { correctId, explainCorrect, explainWrong, ...safeQuestion } = q;
      return safeQuestion;
    });

    return {
      id: mission.id,
      slug: mission.slug,
      order: mission.order,
      title: { ml: mission.titleMl, en: mission.titleEn },
      concept: { ml: mission.conceptMl, en: mission.conceptEn },
      objective: { ml: mission.objectiveMl, en: mission.objectiveEn },
      minutes: mission.minutes,
      subjectId: mission.subjectId,
      versionId: version.id,
      teaching: version.teachingJson,
      activities: version.activitiesJson,
      checkpointPool: sanitizedCheckpointPool, // private answer keys stripped!
      familyPrompt: { ml: version.familyPromptMl, en: version.familyPromptEn },
    };
  }
}
