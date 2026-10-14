import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChildProfileDto {
  @ApiProperty({ example: "Zayan" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname!: string;

  @ApiProperty({ example: "10-11", enum: ["8-9", "10-11", "12-13"] })
  @IsString()
  @IsIn(["8-9", "10-11", "12-13"])
  ageBand!: string;

  @ApiProperty({ example: "ml", enum: ["ml", "en"], required: false })
  @IsString()
  @IsOptional()
  @IsIn(["ml", "en"])
  preferredLanguage?: string;

  @ApiProperty({ example: "3", required: false })
  @IsString()
  @IsOptional()
  priorStandard?: string;

  @ApiProperty({ example: "lantern-noor", required: false })
  @IsString()
  @IsOptional()
  avatarKey?: string;

  @ApiProperty({ example: 3, enum: [2, 3, 5], required: false })
  @IsInt()
  @IsOptional()
  @IsIn([2, 3, 5])
  weeklyGoal?: number;
}

export class UpdateChildProfileDto {
  @ApiProperty({ example: "Zayan", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @ApiProperty({ example: "10-11", enum: ["8-9", "10-11", "12-13"], required: false })
  @IsString()
  @IsOptional()
  @IsIn(["8-9", "10-11", "12-13"])
  ageBand?: string;

  @ApiProperty({ example: "ml", enum: ["ml", "en"], required: false })
  @IsString()
  @IsOptional()
  @IsIn(["ml", "en"])
  preferredLanguage?: string;

  @ApiProperty({ example: "3", required: false })
  @IsString()
  @IsOptional()
  priorStandard?: string;

  @ApiProperty({ example: 3, enum: [2, 3, 5], required: false })
  @IsInt()
  @IsOptional()
  @IsIn([2, 3, 5])
  weeklyGoal?: number;
}

export class UpdateAvatarDto {
  @ApiProperty({ example: "olive-tree" })
  @IsString()
  @IsNotEmpty()
  avatarKey!: string;
}
