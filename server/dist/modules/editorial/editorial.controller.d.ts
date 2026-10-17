import { EditorialService } from "./editorial.service";
import { CreateDraftDto, ReviewContentDto, PublishVersionDto } from "./dto/editorial.dto";
import { Account } from "@prisma/client";
export declare class EditorialController {
    private readonly editorialService;
    constructor(editorialService: EditorialService);
    getOverview(): Promise<{
        stats: {
            totalAccounts: number;
            totalParents: number;
            totalAdmins: number;
            totalChildren: number;
            totalMissions: number;
            totalVersions: number;
            publishedVersions: number;
            reviewPendingVersions: number;
            totalAttempts: number;
        };
        versions: ({
            mission: {
                learningChapter: {
                    world: {
                        id: string;
                        slug: string;
                        titleMl: string;
                        titleEn: string;
                        blurbMl: string;
                        blurbEn: string;
                        playable: boolean;
                        displayOrder: number;
                    };
                } & {
                    id: string;
                    slug: string;
                    titleMl: string;
                    titleEn: string;
                    playable: boolean;
                    displayOrder: number;
                    worldId: string;
                    descriptionMl: string;
                    descriptionEn: string;
                };
            } & {
                id: string;
                slug: string;
                titleMl: string;
                titleEn: string;
                order: number;
                learningChapterId: string;
                conceptMl: string;
                conceptEn: string;
                objectiveMl: string;
                objectiveEn: string;
                minutes: number;
                subjectId: string;
            };
            publications: {
                id: string;
                missionVersionId: string;
                publishedAt: Date;
                releaseNotes: string | null;
                publishedById: string;
            }[];
            reviews: ({
                reviewer: {
                    email: string;
                };
            } & {
                id: string;
                createdAt: Date;
                missionVersionId: string;
                status: import(".prisma/client").$Enums.ReviewStatus;
                comments: string | null;
                reviewerId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            missionId: string;
            publishState: import(".prisma/client").$Enums.PublishState;
            versionString: string;
            reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
            teachingJson: import("@prisma/client/runtime/library").JsonValue;
            activitiesJson: import("@prisma/client/runtime/library").JsonValue;
            checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
            revisionJson: import("@prisma/client/runtime/library").JsonValue;
            familyPromptMl: string;
            familyPromptEn: string;
            supplementary: boolean;
            approvedById: string | null;
            approvedAt: Date | null;
            publishedAt: Date | null;
        })[];
        accounts: {
            email: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            _count: {
                children: number;
            };
        }[];
        children: ({
            parentAccount: {
                email: string;
            };
            _count: {
                attempts: number;
            };
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
        })[];
    }>;
    createDraft(user: Account, missionId: string, dto: CreateDraftDto): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
    submitDraft(user: Account, versionId: string): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
    reviewContent(user: Account, versionId: string, dto: ReviewContentDto): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
    publishVersion(user: Account, versionId: string, dto: PublishVersionDto): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
    archiveVersion(versionId: string): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
    withdrawVersion(versionId: string): Promise<{
        id: string;
        createdAt: Date;
        missionId: string;
        publishState: import(".prisma/client").$Enums.PublishState;
        versionString: string;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        teachingJson: import("@prisma/client/runtime/library").JsonValue;
        activitiesJson: import("@prisma/client/runtime/library").JsonValue;
        checkpointPoolJson: import("@prisma/client/runtime/library").JsonValue;
        revisionJson: import("@prisma/client/runtime/library").JsonValue;
        familyPromptMl: string;
        familyPromptEn: string;
        supplementary: boolean;
        approvedById: string | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
    }>;
}
