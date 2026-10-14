import { PrismaService } from "../../database/prisma.service";
export declare class ContentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWorlds(): Promise<({
        chapters: {
            id: string;
            slug: string;
            titleMl: string;
            titleEn: string;
        }[];
    } & {
        id: string;
        slug: string;
        titleMl: string;
        titleEn: string;
        blurbMl: string;
        blurbEn: string;
        playable: boolean;
        displayOrder: number;
    })[]>;
    getSubjects(): Promise<{
        id: string;
        nameMl: string;
        nameEn: string;
    }[]>;
    getChildJourney(childProfileId: string): Promise<{
        world: {
            id: string;
            slug: string;
            title: {
                ml: string;
                en: string;
            };
        };
        chapter: {
            id: string;
            slug: string;
            title: {
                ml: string;
                en: string;
            };
            description: {
                ml: string;
                en: string;
            };
            badge: {
                id: string;
                slug: string;
                name: {
                    ml: string;
                    en: string;
                };
            } | null;
        };
        missions: {
            id: string;
            slug: string;
            order: number;
            title: {
                ml: string;
                en: string;
            };
            concept: {
                ml: string;
                en: string;
            };
            objective: {
                ml: string;
                en: string;
            };
            minutes: number;
            subjectId: string;
            status: "completed" | "current" | "available" | "locked";
            version: string;
        }[];
    }>;
    getChildChapter(childProfileId: string, chapterId: string): Promise<{
        id: string;
        slug: string;
        title: {
            ml: string;
            en: string;
        };
        description: {
            ml: string;
            en: string;
        };
        badge: {
            id: string;
            slug: string;
            descriptionMl: string;
            descriptionEn: string;
            chapterId: string;
            nameMl: string;
            nameEn: string;
        } | null;
        totalMissions: number;
        completedMissions: number;
    }>;
    getChildMission(childProfileId: string, missionId: string): Promise<{
        id: string;
        slug: string;
        order: number;
        title: {
            ml: string;
            en: string;
        };
        concept: {
            ml: string;
            en: string;
        };
        objective: {
            ml: string;
            en: string;
        };
        minutes: number;
        subjectId: string;
        versionId: string;
        teaching: import("@prisma/client/runtime/library").JsonValue;
        activities: import("@prisma/client/runtime/library").JsonValue;
        checkpointPool: any[];
        familyPrompt: {
            ml: string;
            en: string;
        };
    }>;
}
