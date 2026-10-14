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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let ContentService = class ContentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getChildJourney(childProfileId) {
        const completions = await this.prisma.missionCompletion.findMany({
            where: { childProfileId },
            select: { missionId: true },
        });
        const completedSet = new Set(completions.map((c) => c.missionId));
        const chapter = await this.prisma.learningChapter.findFirst({
            where: { slug: "akhlaq-small-actions" },
            include: {
                world: true,
                missions: {
                    orderBy: { order: "asc" },
                    include: {
                        prerequisites: true,
                        versions: {
                            where: { publishState: client_1.PublishState.PUBLISHED },
                            orderBy: { createdAt: "desc" },
                            take: 1,
                        },
                    },
                },
                badge: true,
            },
        });
        if (!chapter) {
            throw new common_1.NotFoundException({
                errorCode: "CHAPTER_NOT_FOUND",
                message: "Learning chapter not found.",
            });
        }
        let foundCurrent = false;
        const missionsWithStatus = chapter.missions.map((mission) => {
            const isCompleted = completedSet.has(mission.id);
            let status = "locked";
            if (isCompleted) {
                status = "completed";
            }
            else {
                const prereqsMet = mission.prerequisites.every((p) => completedSet.has(p.prerequisiteMissionId));
                if (prereqsMet) {
                    if (!foundCurrent) {
                        status = "current";
                        foundCurrent = true;
                    }
                    else {
                        status = "available";
                    }
                }
                else {
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
    async getChildChapter(childProfileId, chapterId) {
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
            throw new common_1.NotFoundException({
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
    async getChildMission(childProfileId, missionId) {
        const mission = await this.prisma.mission.findUnique({
            where: { id: missionId },
            include: {
                prerequisites: true,
                versions: {
                    where: { publishState: client_1.PublishState.PUBLISHED },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });
        if (!mission) {
            throw new common_1.NotFoundException({
                errorCode: "MISSION_NOT_FOUND",
                message: "Mission not found.",
            });
        }
        const completions = await this.prisma.missionCompletion.findMany({
            where: { childProfileId },
            select: { missionId: true },
        });
        const completedSet = new Set(completions.map((c) => c.missionId));
        const prereqsMet = mission.prerequisites.every((p) => completedSet.has(p.prerequisiteMissionId));
        if (!prereqsMet && !completedSet.has(mission.id)) {
            throw new common_1.ForbiddenException({
                errorCode: "MISSION_LOCKED",
                message: "Complete the previous mission first.",
            });
        }
        const version = mission.versions[0];
        if (!version) {
            throw new common_1.NotFoundException({
                errorCode: "MISSION_VERSION_UNAVAILABLE",
                message: "Published version for this mission is not currently available.",
            });
        }
        const pool = version.checkpointPoolJson;
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
            checkpointPool: sanitizedCheckpointPool,
            familyPrompt: { ml: version.familyPromptMl, en: version.familyPromptEn },
        };
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map