import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReflectionDto {
  @ApiProperty({ example: "m1-kind-words" })
  @IsString()
  @IsNotEmpty()
  missionId!: string;

  @ApiProperty({ example: "We discussed using polite words at home today." })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  note!: string;
}
