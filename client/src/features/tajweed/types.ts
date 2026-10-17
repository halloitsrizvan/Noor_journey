/**
 * Quran Studies → Tajweed → Al-Fatihah
 * Type definitions and data adapter interfaces
 */

export interface FatihahSurahInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameMalayalam?: string;
  verseCount: number;
  numberingNote: string;
}

export interface FatihahAnnotation {
  id: string;
  verseId: string;
  targetWordIds: string[];
  ruleId: string;
  explanation: {
    en: string;
    ml: string;
  };
  sourceReference: string;
  reviewStatus: "draft" | "reviewed" | "approved";
  reviewerId: string | null;
  audioSegmentUrl?: string | null;
  contextLimitation?: string | null;
}

export interface FatihahVerse {
  id: string;
  verseKey: string;
  number: number;
  textUthmani: string;
  audioUrl: string | null;
  translation?: {
    en: string;
    ml: string;
  };
  annotations: FatihahAnnotation[];
}

export interface DraftKnowledgeActivity {
  id: string;
  verseId: string;
  type: "find-word" | "multiple-choice";
  reviewStatus: "draft" | "reviewed" | "approved";
  prompt: {
    en: string;
    ml: string;
  };
  options: {
    id: string;
    wordIndex?: number;
    label?: { en: string; ml: string };
  }[];
  correctOptionIds: string[];
  feedback: {
    en: string;
    ml: string;
  };
}

export interface FatihahMissionNode {
  id: string;
  verseIds: string[];
  templateId: string;
  prerequisites: string[];
}

export interface FatihahModuleData {
  schemaVersion: string;
  id: string;
  slug: string;
  subject: string;
  module: string;
  surah: FatihahSurahInfo;
  titles: {
    en: string;
    ml: string;
  };
  descriptions: {
    en: string;
    ml: string;
  };
  audience: {
    minimumAge: number;
    maximumAge: number;
  };
  curriculum: {
    intendedBoard: string;
    standard: string | null;
    book: string | null;
    chapter: string | null;
    mappingStatus: string;
  };
  source: {
    referenceUrl: string;
    script: string;
    textVerificationStatus: string;
    teachingReviewStatus: string;
    reviewerId: string | null;
    reviewedAt: string | null;
  };
  theme: {
    surface: string;
    accent: string;
    companionAssetKey: string;
    overviewAssetKey: string;
    completionAssetKey: string;
  };
  audio: {
    reciterName: string | null;
    recitationTradition: string | null;
    sourceUrl: string | null;
    usagePermissionStatus: string;
    fullSurahUrl: string | null;
    wordTimingAvailable: boolean;
  };
  verses: FatihahVerse[];
  missions: FatihahMissionNode[];
  draftKnowledgeActivities: DraftKnowledgeActivity[];
  completionPolicy: {
    readingParticipationLabel: string;
    knowledgeRequiresReviewedAssessment: boolean;
    recitationRequiresTeacherAssessment: boolean;
    allowAutomaticRecitationScore: boolean;
    useExistingRewardService: boolean;
    awardReligiousMeritPoints: boolean;
  };
}

/**
 * Three distinct kinds of student progress:
 * 1. Lesson participation (verse explored)
 * 2. Knowledge checks (knowledge activity passed)
 * 3. Recitation assessed by a teacher
 */
export interface VerseProgress {
  verseId: string;
  isExplored: boolean;
  exploredAt?: string;
  knowledgeCheckPassed: boolean;
  knowledgePassedAt?: string;
  recitationStatus: "none" | "awaiting_teacher_review" | "reviewed_by_teacher";
  hasPracticeRecording: boolean;
}

export interface FatihahProgressRecord {
  childId: string;
  verses: Record<string, VerseProgress>;
  lastAccessedVerseId: string;
  updatedAt: string;
}

/**
 * Derives individual word records from exact verse text string.
 * Splits ONLY on standard whitespace, preserving diacritics,
 * shaping, and exact Unicode characters.
 */
export function deriveVerseWords(
  verseText: string,
  verseId: string
): { id: string; wordIndex: number; text: string }[] {
  const words = verseText.trim().split(/\s+/);
  return words.map((w, idx) => ({
    id: `${verseId}-w${idx}`,
    wordIndex: idx,
    text: w,
  }));
}
