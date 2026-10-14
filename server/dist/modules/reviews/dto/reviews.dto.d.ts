export declare class SubmitReviewAnswersDto {
    answers: {
        questionId: string;
        choiceId: string;
    }[];
}
export declare class FinalizeReviewDto {
    idempotencyKey?: string;
}
