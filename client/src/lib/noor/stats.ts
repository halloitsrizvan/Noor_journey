/**
 * Real-time Learning Statistics Calculator for Noor Journey
 */

import type { ChildProgress, MissionProgress } from "./types";
import { getFatihahProgress } from "@/features/tajweed/progress";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates current consecutive active day streak from session timestamps.
 */
export function calculateStreak(sessions: number[] = [], now: number = Date.now()): number {
  if (!sessions || sessions.length === 0) return 0;

  // Extract unique dates formatted as YYYY-MM-DD in local time
  const dateSet = new Set<string>();
  for (const ts of sessions) {
    if (!ts || isNaN(ts)) continue;
    const d = new Date(ts);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dateSet.add(dateStr);
  }

  const sortedDates = Array.from(dateSet).sort().reverse();
  if (sortedDates.length === 0) return 0;

  const nowDate = new Date(now);
  const todayStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

  const yesterdayDate = new Date(now - MS_PER_DAY);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

  // Check if child studied today or yesterday (to keep the streak alive)
  let checkDate: Date;
  if (sortedDates.includes(todayStr)) {
    checkDate = nowDate;
  } else if (sortedDates.includes(yesterdayStr)) {
    checkDate = yesterdayDate;
  } else {
    // If last session was before yesterday, streak is 0
    return 0;
  }

  let streak = 0;
  let curr = new Date(checkDate);

  // Count backwards day by day
  for (let i = 0; i < 365; i++) {
    const str = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, "0")}-${String(curr.getDate()).padStart(2, "0")}`;
    if (sortedDates.includes(str)) {
      streak++;
      curr = new Date(curr.getTime() - MS_PER_DAY);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates real-time total completed missions (Curriculum + Tajweed)
 */
export function calculateCompletedMissions(
  progress: ChildProgress | null,
  childId?: string
): { totalCompleted: number; akhlaqCompleted: number; tajweedCompleted: number } {
  if (!progress) {
    return { totalCompleted: 0, akhlaqCompleted: 0, tajweedCompleted: 0 };
  }

  const akhlaqCompleted = Object.values(progress.missions || {}).filter(
    (m: MissionProgress) => Boolean(m.passedAt)
  ).length;

  let tajweedCompleted = 0;
  if (childId) {
    const fatihah = getFatihahProgress(childId);
    tajweedCompleted = Object.values(fatihah.verses || {}).filter(
      (v) => v.isExplored || v.knowledgeCheckPassed || v.recitationStatus !== "none"
    ).length;
  }

  return {
    totalCompleted: akhlaqCompleted + tajweedCompleted,
    akhlaqCompleted,
    tajweedCompleted,
  };
}
