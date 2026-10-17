import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSubjectDto {
  @ApiProperty({ example: "aqeedah" })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: "Aqeedah" })
  @IsString()
  @IsNotEmpty()
  englishTitle: string;

  @ApiProperty({ example: "അഖീദ" })
  @IsString()
  @IsNotEmpty()
  malayalamTitle: string;

  @ApiProperty({ example: "العقيدة والإيمان" })
  @IsString()
  @IsNotEmpty()
  arabicName: string;

  @ApiProperty({ example: "🌙" })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: "Pillars of Faith" })
  @IsString()
  @IsNotEmpty()
  badgeEn: string;

  @ApiProperty({ example: "ഈമാൻ കാര്യങ്ങൾ" })
  @IsString()
  @IsNotEmpty()
  badgeMl: string;

  @ApiProperty({ example: "Belief in Allah, Angels, Divine Books..." })
  @IsString()
  @IsNotEmpty()
  shortDescEn: string;

  @ApiProperty({ example: "അല്ലാഹുവിലുള്ള വിശ്വാസം, മലക്കുകൾ..." })
  @IsString()
  @IsNotEmpty()
  shortDescMl: string;

  @ApiPropertyOptional({ example: "bg-gradient-to-br from-[#EBF5FF] to-[#D6EBFF]" })
  @IsString()
  @IsOptional()
  bgGradient?: string;

  @ApiPropertyOptional({ example: "border-[#B8DCFF]" })
  @IsString()
  @IsOptional()
  borderColor?: string;

  @ApiPropertyOptional({ example: "text-[#005299]" })
  @IsString()
  @IsOptional()
  textColor?: string;

  @ApiPropertyOptional({ example: "bg-[#0070D1]" })
  @IsString()
  @IsOptional()
  accentBg?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  // Frontend aliases
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  arabicTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gradient?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accentColor?: string;
}

export class UpdateSubjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  englishTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  malayalamTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  arabicName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortDescEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortDescMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bgGradient?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  borderColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  textColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accentBg?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  // Frontend aliases
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  arabicTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gradient?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accentColor?: string;
}

export class CreateTopicDto {
  @ApiProperty({ example: "6 Pillars of Iman" })
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({ example: "ഈമാൻ കാര്യങ്ങൾ 6" })
  @IsString()
  @IsNotEmpty()
  titleMl: string;

  @ApiProperty({ example: "Belief in Allah, Angels, Divine Books..." })
  @IsString()
  @IsNotEmpty()
  descEn: string;

  @ApiProperty({ example: "അല്ലാഹു, മലക്കുകൾ, വേദഗ്രന്ഥങ്ങൾ..." })
  @IsString()
  @IsNotEmpty()
  descMl: string;

  @ApiPropertyOptional({ example: "✨" })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}

export class UpdateTopicDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descMl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  order?: number;
}

export class UpdateVerseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  arabicText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  englishTranslation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  malayalamTranslation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transliteration?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  audioUrl?: string;
}
