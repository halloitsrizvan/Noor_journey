import { ChildrenService } from "./children.service";
import { CreateChildProfileDto, UpdateChildProfileDto, UpdateAvatarDto } from "./dto/children.dto";
import { Account } from "@prisma/client";
export declare class ChildrenController {
    private readonly childrenService;
    constructor(childrenService: ChildrenService);
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
    getChildren(user: Account): Promise<({
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
    createChild(user: Account, dto: CreateChildProfileDto): Promise<{
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
    getChild(user: Account, id: string): Promise<{
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
    updateChild(user: Account, id: string, dto: UpdateChildProfileDto): Promise<{
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
    deleteChild(user: Account, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateAvatar(user: Account, childId: string, dto: UpdateAvatarDto): Promise<{
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
}
