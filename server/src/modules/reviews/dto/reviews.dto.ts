import { IsArray, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SubmitReviewAnswersDto {
  @ApiProperty({ description: "Array of answered questions with questionId and choiceId" })
  @IsArray()
  @IsNotEmpty()
  answers!: { questionId: string; choiceId: string }[];
}

export class FinalizeReviewDto {
  @ApiProperty({ example: "idem-review-123", required: false })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
