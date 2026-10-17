import { OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateSubjectDto, UpdateSubjectDto, CreateTopicDto, UpdateTopicDto, UpdateVerseDto } from "./dto/madrasa.dto";
export interface QariProfile {
    id: string;
    reciterId: number;
    nameEnglish: string;
    nameArabic: string;
    nameMalayalam: string;
    style: string;
    serverSubfolder: string;
    avatarUrl: string;
}
export declare const RENOWNED_QARIS: QariProfile[];
export declare class MadrasaService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private quranClient;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private initQuranClient;
    private formatSubject;
    getSubjects(): Promise<any[]>;
    getSubjectByKey(key: string): Promise<any>;
    createSubject(dto: CreateSubjectDto): Promise<any>;
    updateSubject(id: string, dto: UpdateSubjectDto): Promise<any>;
    deleteSubject(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayOrder: number;
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
    }>;
    createTopic(subjectId: string, dto: CreateTopicDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleMl: string;
        titleEn: string;
        order: number;
        subjectId: string;
        icon: string;
        descEn: string;
        descMl: string;
    }>;
    updateTopic(topicId: string, dto: UpdateTopicDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleMl: string;
        titleEn: string;
        order: number;
        subjectId: string;
        icon: string;
        descEn: string;
        descMl: string;
    }>;
    deleteTopic(topicId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleMl: string;
        titleEn: string;
        order: number;
        subjectId: string;
        icon: string;
        descEn: string;
        descMl: string;
    }>;
    getFatihahVerses(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        arabicText: string;
        englishTranslation: string;
        malayalamTranslation: string;
        transliteration: string;
        audioUrl: string | null;
        verseNumber: number;
        tajweedRulesJson: import("@prisma/client/runtime/library").JsonValue | null;
        wordsJson: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    updateFatihahVerse(verseId: string, dto: UpdateVerseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        arabicText: string;
        englishTranslation: string;
        malayalamTranslation: string;
        transliteration: string;
        audioUrl: string | null;
        verseNumber: number;
        tajweedRulesJson: import("@prisma/client/runtime/library").JsonValue | null;
        wordsJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAvailableQaris(): QariProfile[];
    getFatihahQiraat(qariId?: string): Promise<{
        surah: {
            number: number;
            nameArabic: string;
            nameEnglish: string;
            nameMalayalam: string;
            totalVerses: number;
        };
        qari: QariProfile;
        fullSurahAudioUrl: string;
        verses: {
            verseNumber: number;
            verseKey: string;
            audioUrl: string;
        }[];
    }>;
    private seedInitialMadrasaData;
    private seedAlFatihahCourseData;
}
