import type { FatihahProgressRecord, VerseProgress } from "./types";
import fatihahData from "./data/al-fatihah.json";

const STORAGE_PREFIX = "noor_tajweed_fatihah_v1_";

function getStorageKey(childId: string): string {
  return `${STORAGE_PREFIX}${childId || "default"}`;
}

export function getDefaultFatihahProgress(childId: string): FatihahProgressRecord {
  const initialVerses: Record<string, VerseProgress> = {};
  fatihahData.verses.forEach((v) => {
    initialVerses[v.id] = {
      verseId: v.id,
      isExplored: false,
      knowledgeCheckPassed: false,
      recitationStatus: "none",
      hasPracticeRecording: false,
    };
  });

  return {
    childId: childId || "default",
    verses: initialVerses,
    lastAccessedVerseId: fatihahData.verses[0].id,
    updatedAt: new Date().toISOString(),
  };
}

export function getFatihahProgress(childId: string): FatihahProgressRecord {
  if (typeof window === "undefined") {
    return getDefaultFatihahProgress(childId);
  }

  try {
    const raw = localStorage.getItem(getStorageKey(childId));
    if (raw) {
      const parsed: FatihahProgressRecord = JSON.parse(raw);
      // Ensure all 7 verses exist in case of schema update
      fatihahData.verses.forEach((v) => {
        if (!parsed.verses[v.id]) {
          parsed.verses[v.id] = {
            verseId: v.id,
            isExplored: false,
            knowledgeCheckPassed: false,
            recitationStatus: "none",
            hasPracticeRecording: false,
          };
        }
      });
      return parsed;
    }
  } catch {}

  return getDefaultFatihahProgress(childId);
}

export function saveFatihahProgress(progress: FatihahProgressRecord): void {
  if (typeof window === "undefined") return;
  try {
    progress.updatedAt = new Date().toISOString();
    localStorage.setItem(getStorageKey(progress.childId), JSON.stringify(progress));
  } catch {}
}

export function markVerseExplored(childId: string, verseId: string): FatihahProgressRecord {
  const record = getFatihahProgress(childId);
  const current = record.verses[verseId] || {
    verseId,
    isExplored: false,
    knowledgeCheckPassed: false,
    recitationStatus: "none",
    hasPracticeRecording: false,
  };

  if (!current.isExplored) {
    current.isExplored = true;
    current.exploredAt = new Date().toISOString();
  }

  record.verses[verseId] = current;
  record.lastAccessedVerseId = verseId;
  saveFatihahProgress(record);
  return record;
}

export function markKnowledgePassed(childId: string, verseId: string): FatihahProgressRecord {
  const record = getFatihahProgress(childId);
  const current = record.verses[verseId] || {
    verseId,
    isExplored: true,
    knowledgeCheckPassed: false,
    recitationStatus: "none",
    hasPracticeRecording: false,
  };

  current.isExplored = true;
  current.knowledgeCheckPassed = true;
  current.knowledgePassedAt = new Date().toISOString();

  record.verses[verseId] = current;
  record.lastAccessedVerseId = verseId;
  saveFatihahProgress(record);
  return record;
}

export function submitRecitationForTeacherReview(
  childId: string,
  verseId: string
): FatihahProgressRecord {
  const record = getFatihahProgress(childId);
  const current = record.verses[verseId] || {
    verseId,
    isExplored: true,
    knowledgeCheckPassed: false,
    recitationStatus: "none",
    hasPracticeRecording: false,
  };

  current.recitationStatus = "awaiting_teacher_review";
  record.verses[verseId] = current;
  saveFatihahProgress(record);
  return record;
}

export function markPracticeRecordingSaved(
  childId: string,
  verseId: string
): FatihahProgressRecord {
  const record = getFatihahProgress(childId);
  const current = record.verses[verseId] || {
    verseId,
    isExplored: true,
    knowledgeCheckPassed: false,
    recitationStatus: "none",
    hasPracticeRecording: false,
  };

  current.hasPracticeRecording = true;
  record.verses[verseId] = current;
  saveFatihahProgress(record);
  return record;
}
