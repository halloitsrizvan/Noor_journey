import { MadrasaService } from "./madrasa.service";
import { CreateSubjectDto, UpdateSubjectDto, CreateTopicDto, UpdateTopicDto, UpdateVerseDto } from "./dto/madrasa.dto";
export declare class MadrasaController {
    private readonly madrasaService;
    constructor(madrasaService: MadrasaService);
    getSubjects(): Promise<any[]>;
    getSubjectByKey(key: string): Promise<any>;
    createSubject(dto: CreateSubjectDto): Promise<any>;
    updateSubject(id: string, dto: UpdateSubjectDto): Promise<any>;
    deleteSubject(id: string): Promise<{
        id: string;
        key: string;
        englishTitle: string;
        malayalamTitle: string;
        arabicName: string;
        icon: string;
        badgeEn: string;
        badgeMl: string;
        shortDescEn: string;
        shortDescMl: string;
        bgGradient: string;
        borderColor: string;
        textColor: string;
        accentBg: string;
        displayOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTopic(id: string, dto: CreateTopicDto): Promise<{
        id: string;
        icon: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        subjectId: string;
        titleEn: string;
        titleMl: string;
        descEn: string;
        descMl: string;
    }>;
    updateTopic(topicId: string, dto: UpdateTopicDto): Promise<{
        id: string;
        icon: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        subjectId: string;
        titleEn: string;
        titleMl: string;
        descEn: string;
        descMl: string;
    }>;
    deleteTopic(topicId: string): Promise<{
        id: string;
        icon: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        subjectId: string;
        titleEn: string;
        titleMl: string;
        descEn: string;
        descMl: string;
    }>;
    getFatihahVerses(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verseNumber: number;
        arabicText: string;
        englishTranslation: string;
        malayalamTranslation: string;
        transliteration: string;
        tajweedRulesJson: import("@prisma/client/runtime/library").JsonValue | null;
        wordsJson: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
    }[]>;
    updateFatihahVerse(verseId: string, dto: UpdateVerseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verseNumber: number;
        arabicText: string;
        englishTranslation: string;
        malayalamTranslation: string;
        transliteration: string;
        tajweedRulesJson: import("@prisma/client/runtime/library").JsonValue | null;
        wordsJson: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
    }>;
    getAvailableQaris(): import("./madrasa.service").QariProfile[];
    getFatihahAudio(qari: string): Promise<{
        surah: {
            number: number;
            nameArabic: string;
            nameEnglish: string;
            nameMalayalam: string;
            totalVerses: number;
        };
        qari: import("./madrasa.service").QariProfile;
        fullSurahAudioUrl: string;
        verses: {
            verseNumber: number;
            verseKey: string;
            audioUrl: string;
        }[];
    }>;
}
