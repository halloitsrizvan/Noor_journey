import { TAJWEED_CURRICULUMS } from "./data/tajweedRoadmapData";

export interface TajweedRoadmapProgress {
  unlockedIds: string[];
  completedIds: string[];
  quizScores: Record<string, { attempts: number; passedAt: number }>;
}

const STORAGE_PREFIX = "noor_tajweed_curriculum_progress_";

export function getTajweedCurriculumProgress(childId: string): TajweedRoadmapProgress {
  const firstId = TAJWEED_CURRICULUMS[0]?.id || "makharij-al-huruf";
  const defaultProgress: TajweedRoadmapProgress = {
    unlockedIds: [firstId],
    completedIds: [],
    quizScores: {},
  };

  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${childId}`);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as TajweedRoadmapProgress;

    // Ensure at least the first is unlocked
    if (!parsed.unlockedIds || !parsed.unlockedIds.includes(firstId)) {
      parsed.unlockedIds = Array.from(new Set([firstId, ...(parsed.unlockedIds || [])]));
    }
    return parsed;
  } catch (err) {
    console.error("Error loading Tajweed roadmap progress:", err);
    return defaultProgress;
  }
}

export function completeTajweedCurriculum(
  childId: string,
  curriculumId: string
): { nextUnlockedId: string | null; isNewCompletion: boolean; xpEarned: number } {
  const current = getTajweedCurriculumProgress(childId);
  const isNew = !current.completedIds.includes(curriculumId);

  const targetIndex = TAJWEED_CURRICULUMS.findIndex((c) => c.id === curriculumId);
  const targetItem = TAJWEED_CURRICULUMS[targetIndex];
  const xpEarned = isNew ? targetItem?.xpReward || 15 : 0;

  const nextItem = targetIndex >= 0 && targetIndex < TAJWEED_CURRICULUMS.length - 1
    ? TAJWEED_CURRICULUMS[targetIndex + 1]
    : null;

  const nextUnlockedId = nextItem ? nextItem.id : null;

  const updatedCompleted = Array.from(new Set([...current.completedIds, curriculumId]));
  const updatedUnlocked = Array.from(
    new Set([...current.unlockedIds, ...(nextUnlockedId ? [nextUnlockedId] : [])])
  );

  const updated: TajweedRoadmapProgress = {
    unlockedIds: updatedUnlocked,
    completedIds: updatedCompleted,
    quizScores: {
      ...current.quizScores,
      [curriculumId]: {
        attempts: (current.quizScores[curriculumId]?.attempts || 0) + 1,
        passedAt: Date.now(),
      },
    },
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${childId}`, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving Tajweed roadmap progress:", err);
    }
  }

  return {
    nextUnlockedId,
    isNewCompletion: isNew,
    xpEarned,
  };
}

export function isCurriculumUnlocked(childId: string, curriculumId: string): boolean {
  const prog = getTajweedCurriculumProgress(childId);
  return prog.unlockedIds.includes(curriculumId);
}
