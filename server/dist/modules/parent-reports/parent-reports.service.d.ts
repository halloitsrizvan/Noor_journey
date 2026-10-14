import { PrismaService } from "../../database/prisma.service";
import { ClockService } from "../../common/clock/clock.service";
export declare class ParentReportsService {
    private readonly prisma;
    private readonly clock;
    constructor(prisma: PrismaService, clock: ClockService);
    getChildSummary(childProfileId: string): Promise<{
        child: {
            id: string;
            nickname: string;
            ageBand: string;
            preferredLanguage: string;
            weeklyGoal: number;
            timezone: string;
        };
        stats: {
            totalXp: number;
            completedCount: number;
            weeklyCompletedSessions: number;
            weeklyActiveDays: number;
            weeklyGoal: number;
        };
        masteredConcepts: {
            missionId: string;
            title: {
                ml: string;
                en: string;
            };
            concept: {
                ml: string;
                en: string;
            };
            completedAt: Date;
        }[];
        dueRevisions: {
            missionId: string;
            title: {
                ml: string;
                en: string;
            };
            concept: {
                ml: string;
                en: string;
            };
            stage: number;
            dueAt: Date;
        }[];
        badges: {
            slug: string;
            name: {
                ml: string;
                en: string;
            };
            awardedAt: Date;
        }[];
    }>;
}
