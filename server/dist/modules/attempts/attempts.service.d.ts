import { PrismaService } from "../../database/prisma.service";
import { ClockService } from "../../common/clock/clock.service";
export declare class AttemptsService {
    private readonly prisma;
    private readonly clock;
    constructor(prisma: PrismaService, clock: ClockService);
    createAttempt(childProfileId: string, missionId: string, versionId?: string): Promise<{
        missionVersion: {
            mission: {
                id: string;
                titleMl: string;
                titleEn: string;
            };
            id: string;
            versionString: string;
        };
    } & {
        id: string;
        childProfileId: string;
        missionVersionId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: import(".prisma/client").$Enums.AttemptStatus;
        progressRevision: number;
    }>;
    getAttempt(attemptId: string): Promise<{
        submissions: {
            id: string;
            activityId: string;
            payloadJson: import("@prisma/client/runtime/library").JsonValue;
            isCorrect: boolean;
            feedbackMl: string;
            feedbackEn: string;
            submittedAt: Date;
            attemptId: string;
        }[];
        checkpoints: {
            id: string;
            attemptId: string;
            score: number;
            maxScore: number;
            passed: boolean;
            passedAt: Date | null;
            answersJson: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        id: string;
        childProfileId: string;
        missionVersionId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: import(".prisma/client").$Enums.AttemptStatus;
        progressRevision: number;
    }>;
    submitActivity(attemptId: string, activityId: string, payload: any): Promise<{
        submissionId: string;
        isCorrect: boolean;
        feedback: {
            ml: any;
            en: any;
        };
    }>;
    createCheckpoint(attemptId: string): Promise<{
        id: string;
        attemptId: string;
        score: number;
        maxScore: number;
        passed: boolean;
        passedAt: Date | null;
        answersJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
    submitCheckpointAnswer(checkpointId: string, questionId: string, choiceId: string): Promise<{
        isCorrect: boolean;
        feedback: {
            ml: any;
            en: any;
        };
        currentScore: number;
        totalAnswered: number;
    }>;
    finalizeCheckpoint(childProfileId: string, checkpointId: string, idempotencyKey?: string): Promise<{
        passed: boolean;
        score: number;
        maxScore: number;
        xpEarned: number;
        newBadgeUnlocked: boolean;
        progressRevision: number;
        message: string;
        isFirstCompletion?: undefined;
        badge?: undefined;
    } | {
        passed: boolean;
        score: number;
        maxScore: number;
        xpEarned: number;
        isFirstCompletion: boolean;
        newBadgeUnlocked: boolean;
        badge: string | null;
        progressRevision: number;
        message?: undefined;
    }>;
}
