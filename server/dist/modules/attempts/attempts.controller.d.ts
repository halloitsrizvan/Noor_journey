import { AttemptsService } from "./attempts.service";
import { CreateAttemptDto, SubmitActivityDto, SubmitCheckpointAnswerDto, FinalizeCheckpointDto } from "./dto/attempts.dto";
export declare class AttemptsController {
    private readonly attemptsService;
    constructor(attemptsService: AttemptsService);
    createAttempt(childId: string, missionId: string, dto: CreateAttemptDto): Promise<{
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
    submitActivity(attemptId: string, activityId: string, dto: SubmitActivityDto): Promise<{
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
    submitCheckpointAnswer(checkpointId: string, dto: SubmitCheckpointAnswerDto): Promise<{
        isCorrect: boolean;
        feedback: {
            ml: any;
            en: any;
        };
        currentScore: number;
        totalAnswered: number;
    }>;
    finalizeCheckpoint(childId: string, checkpointId: string, idempotencyHeader?: string, dto?: FinalizeCheckpointDto): Promise<{
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
