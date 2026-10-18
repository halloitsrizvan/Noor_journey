/**
 * Subject Curriculum Roadmap Progress Manager
 * Tracks whether a child has completed the Curriculum Roadmap for each of the 5 Madrasa subjects:
 * 1. Tajweed (🎙️)
 * 2. Aqeedah (🌙)
 * 3. Fiqh (💧)
 * 4. Lisanul Quran (📖)
 * 5. Akhlaq (💛)
 */

import { getTajweedCurriculumProgress } from "@/features/tajweed/progressRoadmap";
import { getFatihahProgress } from "@/features/tajweed/progress";
import fatihahData from "@/features/tajweed/data/al-fatihah.json";
import { akhlaqMissions } from "@/content/chapter-akhlaq";

const ROADMAP_COMPLETION_PREFIX = "noor_subject_roadmap_completed_";

export interface SubjectRoadmapStatus {
  tajweed: boolean;
  aqeedah: boolean;
  fiqh: boolean;
  "lisanul-quran": boolean;
  akhlaq: boolean;
}

export function getCompletedSubjectRoadmaps(childId: string, activeProgress?: any): SubjectRoadmapStatus {
  if (typeof window === "undefined") {
    return {
      tajweed: false,
      aqeedah: false,
      fiqh: false,
      "lisanul-quran": false,
      akhlaq: false,
    };
  }

  // 1. Check explicit completion records from storage
  let stored: Partial<SubjectRoadmapStatus> = {};
  try {
    const raw = localStorage.getItem(`${ROADMAP_COMPLETION_PREFIX}${childId}`);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {}

  // 2. Check dynamic Tajweed roadmap: completed if explicit, or if all Fatihah / Tajweed levels passed
  let tajweedComplete = !!stored.tajweed;
  if (!tajweedComplete) {
    try {
      const tajweedProg = getTajweedCurriculumProgress(childId);
      const fatihahProg = getFatihahProgress(childId);
      const passedVerses = Object.values(fatihahProg.verses).filter((v) => v.knowledgeCheckPassed).length;
      // Tajweed considered complete if roadmap levels completed >= 3 or all Fatihah passed
      if (tajweedProg.completedIds.length >= 3 || passedVerses >= fatihahData.verses.length) {
        tajweedComplete = true;
      }
    } catch {}
  }

  // 3. Check Akhlaq roadmap: completed if explicit or all akhlaq missions passed
  let akhlaqComplete = !!stored.akhlaq;
  if (!akhlaqComplete && activeProgress?.missions) {
    const passedAkhlaq = akhlaqMissions.filter((m) => activeProgress.missions[m.id]?.passedAt).length;
    if (passedAkhlaq >= akhlaqMissions.length) {
      akhlaqComplete = true;
    }
  }

  return {
    tajweed: tajweedComplete,
    aqeedah: !!stored.aqeedah,
    fiqh: !!stored.fiqh,
    "lisanul-quran": !!stored["lisanul-quran"],
    akhlaq: akhlaqComplete,
  };
}

export function setSubjectRoadmapCompleted(
  childId: string,
  subjectKey: "tajweed" | "aqeedah" | "fiqh" | "lisanul-quran" | "akhlaq",
  completed: boolean
): SubjectRoadmapStatus {
  if (typeof window === "undefined") {
    return {
      tajweed: false,
      aqeedah: false,
      fiqh: false,
      "lisanul-quran": false,
      akhlaq: false,
    };
  }

  let stored: Partial<SubjectRoadmapStatus> = {};
  try {
    const raw = localStorage.getItem(`${ROADMAP_COMPLETION_PREFIX}${childId}`);
    if (raw) stored = JSON.parse(raw);
  } catch {}

  stored[subjectKey] = completed;

  try {
    localStorage.setItem(`${ROADMAP_COMPLETION_PREFIX}${childId}`, JSON.stringify(stored));
    // Dispatch storage event so other components update synchronously
    window.dispatchEvent(new Event("noor-curriculum-roadmap-updated"));
  } catch {}

  return getCompletedSubjectRoadmaps(childId);
}

const LESSON_PROGRESS_PREFIX = "noor_subject_lesson_progress_";

export interface SubjectLessonProgressMap {
  [subjectKey: string]: {
    completedTopicIndices: number[];
  };
}

export function getSubjectLessonProgress(childId: string, subjectKey: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${LESSON_PROGRESS_PREFIX}${childId}`);
    if (raw) {
      const parsed: SubjectLessonProgressMap = JSON.parse(raw);
      return Array.isArray(parsed[subjectKey]?.completedTopicIndices)
        ? parsed[subjectKey].completedTopicIndices
        : [];
    }
  } catch {}
  return [];
}

export function markSubjectLessonCompleted(
  childId: string,
  subjectKey: "tajweed" | "aqeedah" | "fiqh" | "lisanul-quran" | "akhlaq",
  topicIndex: number,
  totalTopicsCount?: number
): { completedIndices: number[]; newlyCompletedRoadmap: boolean } {
  if (typeof window === "undefined") {
    return { completedIndices: [topicIndex], newlyCompletedRoadmap: false };
  }

  let parsed: SubjectLessonProgressMap = {};
  try {
    const raw = localStorage.getItem(`${LESSON_PROGRESS_PREFIX}${childId}`);
    if (raw) parsed = JSON.parse(raw);
  } catch {}

  if (!parsed[subjectKey]) {
    parsed[subjectKey] = { completedTopicIndices: [] };
  }

  if (!parsed[subjectKey].completedTopicIndices.includes(topicIndex)) {
    parsed[subjectKey].completedTopicIndices.push(topicIndex);
    parsed[subjectKey].completedTopicIndices.sort((a, b) => a - b);
  }

  try {
    localStorage.setItem(`${LESSON_PROGRESS_PREFIX}${childId}`, JSON.stringify(parsed));
  } catch {}

  const currentIndices = parsed[subjectKey].completedTopicIndices;
  let newlyCompletedRoadmap = false;

  // Check if all lessons are now complete
  if (totalTopicsCount && totalTopicsCount > 0) {
    const hasAll = Array.from({ length: totalTopicsCount }).every((_, i) => currentIndices.includes(i));
    if (hasAll) {
      const currentRoadmaps = getCompletedSubjectRoadmaps(childId);
      if (!currentRoadmaps[subjectKey]) {
        newlyCompletedRoadmap = true;
        setSubjectRoadmapCompleted(childId, subjectKey, true);
      }
    }
  }

  window.dispatchEvent(new Event("noor-curriculum-roadmap-updated"));
  return { completedIndices: currentIndices, newlyCompletedRoadmap };
}
