import { PrismaService } from "../../database/prisma.service";
import { ClockService } from "../../common/clock/clock.service";
export declare class ReviewsService {
    private readonly prisma;
    private readonly clock;
    constructor(prisma: PrismaService, clock: ClockService);
    getDueReviews(childProfileId: string): Promise<{
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
    createReviewAttempt(childProfileId: string, reviewScheduleId: string): Promise<{
        id: string;
        childProfileId: string;
        missionId: string;
        passed: boolean;
        passedAt: Date;
        answersJson: import("@prisma/client/runtime/library").JsonValue;
        reviewScheduleId: string;
    }>;
    submitReviewAnswers(attemptId: string, answers: {
        questionId: string;
        choiceId: string;
    }[]): Promise<{
        id: string;
        childProfileId: string;
        missionId: string;
        passed: boolean;
        passedAt: Date;
        answersJson: import("@prisma/client/runtime/library").JsonValue;
        reviewScheduleId: string;
    }>;
    finalizeReview(childProfileId: string, attemptId: string, idempotencyKey?: string): Promise<{
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
}
