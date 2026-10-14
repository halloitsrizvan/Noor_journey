import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ReviewStatus } from "@prisma/client";

export class CreateDraftDto {
  @ApiProperty({ example: "0.2-draft" })
  @IsString()
  @IsNotEmpty()
  versionString!: string;

  @ApiProperty({ description: "Teaching content JSON" })
  @IsNotEmpty()
  teachingJson: any;

  @ApiProperty({ description: "Activities JSON" })
  @IsNotEmpty()
  activitiesJson: any;

  @ApiProperty({ description: "Checkpoint pool JSON" })
  @IsNotEmpty()
  checkpointPoolJson: any;

  @ApiProperty({ description: "Revision questions JSON" })
  @IsNotEmpty()
  revisionJson: any;

  @ApiProperty({ example: "Family reflection in Malayalam" })
  @IsString()
  @IsNotEmpty()
  familyPromptMl!: string;

  @ApiProperty({ example: "Family reflection in English" })
  @IsString()
  @IsNotEmpty()
  familyPromptEn!: string;
}

export class ReviewContentDto {
  @ApiProperty({ enum: ["APPROVED", "REJECTED"] })
  @IsEnum(["APPROVED", "REJECTED"])
  status!: "APPROVED" | "REJECTED";

  @ApiProperty({ example: "Verified pedagogical flow and curriculum objectives.", required: false })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class PublishVersionDto {
  @ApiProperty({ example: "Initial verified release", required: false })
  @IsString()
  @IsOptional()
  releaseNotes?: string;
}
