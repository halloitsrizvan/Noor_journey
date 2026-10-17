export declare class CreateSubjectDto {
    key: string;
    englishTitle: string;
    malayalamTitle: string;
    arabicName: string;
    icon: string;
    badgeEn: string;
    badgeMl: string;
    shortDescEn: string;
    shortDescMl: string;
    bgGradient?: string;
    borderColor?: string;
    textColor?: string;
    accentBg?: string;
    displayOrder?: number;
    titleEn?: string;
    titleMl?: string;
    arabicTitle?: string;
    descEn?: string;
    descMl?: string;
    badgeText?: string;
    gradient?: string;
    accentColor?: string;
}
export declare class UpdateSubjectDto {
    englishTitle?: string;
    malayalamTitle?: string;
    arabicName?: string;
    icon?: string;
    badgeEn?: string;
    badgeMl?: string;
    shortDescEn?: string;
    shortDescMl?: string;
    bgGradient?: string;
    borderColor?: string;
    textColor?: string;
    accentBg?: string;
    displayOrder?: number;
    titleEn?: string;
    titleMl?: string;
    arabicTitle?: string;
    descEn?: string;
    descMl?: string;
    badgeText?: string;
    gradient?: string;
    accentColor?: string;
}
export declare class CreateTopicDto {
    titleEn: string;
    titleMl: string;
    descEn: string;
    descMl: string;
    icon?: string;
    order?: number;
}
export declare class UpdateTopicDto {
    titleEn?: string;
    titleMl?: string;
    descEn?: string;
    descMl?: string;
    icon?: string;
    order?: number;
}
export declare class UpdateVerseDto {
    arabicText?: string;
    englishTranslation?: string;
    malayalamTranslation?: string;
    transliteration?: string;
    audioUrl?: string;
}
