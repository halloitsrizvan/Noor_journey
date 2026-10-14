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
        createdAt: Date;
        updatedAt: Date;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
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
        createdAt: Date;
        updatedAt: Date;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
    }>;
    createChild(parentAccountId: string, dto: CreateChildProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
    }>;
    updateChild(parentAccountId: string, childId: string, dto: UpdateChildProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
    }>;
    deleteChild(parentAccountId: string, childId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateAvatar(parentAccountId: string, childId: string, avatarKey: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentAccountId: string;
        nickname: string;
        ageBand: string;
        preferredLanguage: string;
        priorStandard: string | null;
        avatarKey: string;
        weeklyGoal: number;
        timezone: string;
    }>;
}
