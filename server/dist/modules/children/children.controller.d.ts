import { ChildrenService } from "./children.service";
import { CreateChildProfileDto, UpdateChildProfileDto, UpdateAvatarDto } from "./dto/children.dto";
import { Account } from "@prisma/client";
export declare class ChildrenController {
    private readonly childrenService;
    constructor(childrenService: ChildrenService);
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
    createChild(user: Account, dto: CreateChildProfileDto): Promise<{
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
    updateChild(user: Account, id: string, dto: UpdateChildProfileDto): Promise<{
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
    deleteChild(user: Account, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateAvatar(user: Account, childId: string, dto: UpdateAvatarDto): Promise<{
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
