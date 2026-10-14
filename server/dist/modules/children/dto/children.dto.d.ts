export declare class CreateChildProfileDto {
    nickname: string;
    ageBand: string;
    preferredLanguage?: string;
    priorStandard?: string;
    avatarKey?: string;
    weeklyGoal?: number;
}
export declare class UpdateChildProfileDto {
    nickname?: string;
    ageBand?: string;
    preferredLanguage?: string;
    priorStandard?: string;
    weeklyGoal?: number;
}
export declare class UpdateAvatarDto {
    avatarKey: string;
}
