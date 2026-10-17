import { PrismaService } from "../../database/prisma.service";
import { CreateChildProfileDto, UpdateChildProfileDto } from "./dto/children.dto";
export declare class ChildrenService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getChildren(parentAccountId: string): Promise<({
        completions: {
            missionId: string;
            firstCompletedAt: Date;
        }[];
        badgeAwards: {
            badgeId: string;
            awardedAt: Date;
        }[];
    } & {
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getChild(parentAccountId: string, childId: string): Promise<{
        completions: {
            id: string;
            childProfileId: string;
            missionId: string;
            missionVersionId: string;
            firstCompletedAt: Date;
            completedCount: number;
        }[];
        badgeAwards: {
            id: string;
            childProfileId: string;
            badgeId: string;
            awardedAt: Date;
        }[];
    } & {
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createChild(parentAccountId: string, dto: CreateChildProfileDto): Promise<{
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateChild(parentAccountId: string, childId: string, dto: UpdateChildProfileDto): Promise<{
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteChild(parentAccountId: string, childId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateAvatar(parentAccountId: string, childId: string, avatarKey: string): Promise<{
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLeaderboard(): Promise<{
        rank: number;
        id: string;
        name: string;
        avatar: string;
        totalXp: number;
        stars: number;
        badgesCount: number;
        completedCount: number;
        createdAt: Date;
    }[]>;
    syncStudent(dto: {
        nickname: string;
        email?: string;
        ageBand?: string;
        priorStandard?: string;
        avatarKey?: string;
        weeklyGoal?: number;
    }): Promise<{
        id: string;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
