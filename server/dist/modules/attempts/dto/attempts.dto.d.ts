export declare class CreateAttemptDto {
    missionVersionId?: string;
}
export declare class SubmitActivityDto {
    payload: any;
}
export declare class SubmitCheckpointAnswerDto {
    questionId: string;
    choiceId: string;
}
export declare class FinalizeCheckpointDto {
    idempotencyKey?: string;
}
