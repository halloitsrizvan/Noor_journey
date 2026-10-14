import { ReviewsService } from "./reviews.service";
import { RewardsService } from "../rewards/rewards.service";
import { SubmitReviewAnswersDto, FinalizeReviewDto } from "./dto/reviews.dto";
export declare class ReviewsController {
    private readonly reviewsService;
    private readonly rewardsService;
    constructor(reviewsService: ReviewsService, rewardsService: RewardsService);
    getDueReviews(childId: string): Promise<{
        id: string;
        missionId: string;
        stage: number;
        dueAt: Date;
        missionTitle: {
            ml: string;
            en: string;
        };
        concept: {
            ml: string;
            en: string;
        };
        questions: any[];
    }[]>;
    createReviewAttempt(childId: string, reviewId: string): Promise<{
        id: string;
        childProfileId: string;
        missionId: string;
        passed: boolean;
        passedAt: Date;
        answersJson: import("@prisma/client/runtime/library").JsonValue;
        reviewScheduleId: string;
    }>;
    submitReviewAnswers(attemptId: string, dto: SubmitReviewAnswersDto): Promise<{
        id: string;
        childProfileId: string;
        missionId: string;
        passed: boolean;
        passedAt: Date;
        answersJson: import("@prisma/client/runtime/library").JsonValue;
        reviewScheduleId: string;
    }>;
    finalizeReview(childId: string, attemptId: string, idempotencyHeader?: string, dto?: FinalizeReviewDto): Promise<{
        passed: boolean;
        xpEarned: number;
        retained: boolean;
        nextDueAt: Date;
        message: string;
        nextStage?: undefined;
    } | {
        passed: boolean;
        xpEarned: number;
        retained: boolean;
        nextStage: number;
        nextDueAt: Date;
        message?: undefined;
    }>;
    getProgress(childId: string): Promise<{
        totalXp: number;
        currentLevel: number;
        completedMissionsCount: number;
        weeklyGoal: number;
        weeklyCompletedSessions: number;
        weeklyActiveDays: number;
    }>;
    getCollection(childId: string): Promise<{
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
