import { ContentService } from "./content.service";
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
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
    getChildJourney(childId: string): Promise<{
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
    getChildChapter(childId: string, chapterId: string): Promise<{
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
    getChildMission(childId: string, missionId: string): Promise<{
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
