import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAttemptDto {
  @ApiProperty({ example: "version-uuid", required: false })
  @IsString()
  @IsOptional()
  missionVersionId?: string;
}

export class SubmitActivityDto {
  @ApiProperty({ description: "Client submitted answer selection (choice ID, ordered IDs, or pair IDs)" })
  @IsNotEmpty()
  payload: any;
}

export class SubmitCheckpointAnswerDto {
  @ApiProperty({ example: "m1c1" })
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty({ example: "m1c1-0" })
  @IsString()
  @IsNotEmpty()
  choiceId!: string;
}

export class FinalizeCheckpointDto {
  @ApiProperty({ example: "idem-123456789", required: false })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
