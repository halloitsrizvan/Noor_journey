import { PrismaService } from "../../database/prisma.service";
import { ClockService } from "../../common/clock/clock.service";
export declare class RewardsService {
    private readonly prisma;
    private readonly clock;
    constructor(prisma: PrismaService, clock: ClockService);
    getProgress(childProfileId: string): Promise<{
        totalXp: number;
        currentLevel: number;
        completedMissionsCount: number;
        weeklyGoal: number;
        weeklyCompletedSessions: number;
        weeklyActiveDays: number;
    }>;
    getCollection(childProfileId: string): Promise<{
        badges: {
            id: string;
            slug: string;
            name: {
                ml: string;
                en: string;
            };
            description: {
                ml: string;
                en: string;
            };
            chapterTitle: {
                ml: string;
                en: string;
            };
            earned: boolean;
            awardedAt: Date | null;
        }[];
        avatars: {
            id: string;
            name: {
                ml: string;
                en: string;
            };
            color: string;
            unlocked: boolean;
        }[];
    }>;
}
