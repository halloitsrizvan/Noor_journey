import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type {
  AgeBand,
  ChildProfile,
  ChildProgress,
  Lang,
  NoorState,
  PriorStandard,
  ReviewItem,
} from "./types";
import {
  clearStoredState,
  createDefaultProfile,
  createInitialProgress,
  createInitialState,
  loadStoredState,
  saveStoredState,
} from "./storage";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { akhlaqChapter } from "@/content/worlds-data";

export interface NoorContextValue {
  state: NoorState;
  activeProfile: ChildProfile | null;
  activeProgress: ChildProgress | null;
  lang: Lang;
  effectiveNow: number;
  setLang: (lang: Lang) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  setActiveProfileId: (id: string) => void;
  createProfile: (data: {
    nickname: string;
    ageBand: AgeBand;
    priorStandard: PriorStandard;
    avatarId: string;
    weeklyGoal: 2 | 3 | 5;
  }) => string;
  deleteProfile: (id: string) => void;
  updateWeeklyGoal: (goal: 2 | 3 | 5) => void;
  updateAvatar: (avatarId: string) => void;
  completeMission: (missionId: string, checkpointScore: number) => { xpAwarded: number; newBadge: boolean };
  completeReview: (missionId: string) => { xpAwarded: number };
  saveReflection: (missionId: string, note: string) => void;
  advanceDayOffset: (days: number) => void;
  setDayOffset: (days: number) => void;
  toggleSimulateFailure: () => void;
  resetDemo: () => void;
  // Computed helpers
  getMissionStatus: (missionId: string) => "completed" | "current" | "available" | "locked" | "coming-soon";
  getDueReviews: () => { missionId: string; review: ReviewItem; missionTitle: { ml: string; en: string } }[];
  getTotalXp: () => number;
  getCurrentLevel: () => number;
  getWeeklyProgressCount: () => number;
}

const NoorContext = createContext<NoorContextValue | null>(null);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const NoorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NoorState>(() => loadStoredState());

  // Save to localStorage on state changes
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const lang = state.prefs.lang;
  const effectiveNow = useMemo(() => {
    return Date.now() + state.dayOffset * MS_PER_DAY;
  }, [state.dayOffset]);

  const activeProfile = useMemo(() => {
    return state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0] ?? null;
  }, [state.profiles, state.activeProfileId]);

  const activeProgress = useMemo((): ChildProgress | null => {
    if (!activeProfile) return null;
    return state.progress[activeProfile.id] ?? null;
  }, [state.progress, activeProfile]);

  const setLang = useCallback((newLang: Lang) => {
    setState((prev) => ({
      ...prev,
      prefs: { ...prev.prefs, lang: newLang },
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      prefs: { ...prev.prefs, sound: !prev.prefs.sound },
    }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      prefs: { ...prev.prefs, reducedMotion: !prev.prefs.reducedMotion },
    }));
  }, []);

  const setActiveProfileId = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activeProfileId: id,
    }));
  }, []);

  const createProfile = useCallback(
    (data: {
      nickname: string;
      ageBand: AgeBand;
      priorStandard: PriorStandard;
      avatarId: string;
      weeklyGoal: 2 | 3 | 5;
    }) => {
      const id = `profile-${Date.now()}`;
      const newProfile: ChildProfile = {
        id,
        nickname: data.nickname || "കുട്ടി",
        ageBand: data.ageBand,
        priorStandard: data.priorStandard,
        avatarId: data.avatarId || "lantern-noor",
        cosmeticId: null,
        weeklyGoal: data.weeklyGoal,
        recommendedStart: "akhlaq-small-actions",
        createdAt: effectiveNow,
      };

      setState((prev) => ({
        ...prev,
        profiles: [...prev.profiles, newProfile],
        activeProfileId: id,
        progress: {
          ...prev.progress,
          [id]: createInitialProgress(),
        },
      }));
      return id;
    },
    [effectiveNow]
  );

  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      const remainingProfiles = prev.profiles.filter((p) => p.id !== id);
      const newProgress = { ...prev.progress };
      delete newProgress[id];
      const nextActive = remainingProfiles.length > 0 ? remainingProfiles[0].id : null;
      return {
        ...prev,
        profiles: remainingProfiles,
        activeProfileId: nextActive,
        progress: newProgress,
      };
    });
  }, []);

  const updateWeeklyGoal = useCallback((goal: 2 | 3 | 5) => {
    setState((prev) => {
      if (!prev.activeProfileId) return prev;
      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, weeklyGoal: goal } : p
        ),
      };
    });
  }, []);

  const updateAvatar = useCallback((avatarId: string) => {
    setState((prev) => {
      if (!prev.activeProfileId) return prev;
      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, avatarId } : p
        ),
      };
    });
  }, []);

  const completeMission = useCallback(
    (missionId: string, checkpointScore: number): { xpAwarded: number; newBadge: boolean } => {
      if (!activeProfile || !activeProgress) return { xpAwarded: 0, newBadge: false };

      const profileId = activeProfile.id;
      const dedupeXpId = `mission-complete-${profileId}-${missionId}`;
      const alreadyAwardedXp = activeProgress.xp.some((tx) => tx.id === dedupeXpId);
      const xpAmount = alreadyAwardedXp ? 0 : 20;

      const passedMission = {
        attempts: (activeProgress.missions[missionId]?.attempts ?? 0) + 1,
        passedAt: effectiveNow,
        lastCheckpointScore: checkpointScore,
      };

      // Review intervals: stage 0 at +1 day, stage 1 at +3 days, stage 2 at +7 days
      const existingReview = activeProgress.reviews[missionId];
      const updatedReview: ReviewItem = existingReview ?? {
        missionId,
        stage: 0,
        dueAt: effectiveNow + 1 * MS_PER_DAY,
        retained: false,
      };

      const newMissions = {
        ...activeProgress.missions,
        [missionId]: passedMission,
      };

      // Check if all 5 chapter missions completed
      const allMissionsCompleted = akhlaqMissions.every((m) => newMissions[m.id]?.passedAt);
      const alreadyHasBadge = activeProgress.badges.includes(akhlaqChapter.badge.id);
      const earnedBadge = allMissionsCompleted && !alreadyHasBadge;

      const newBadges = earnedBadge
        ? [...activeProgress.badges, akhlaqChapter.badge.id]
        : activeProgress.badges;

      const newXpTransactions = xpAmount > 0
        ? [
            ...activeProgress.xp,
            {
              id: dedupeXpId,
              amount: xpAmount,
              reason: "mission" as const,
              at: effectiveNow,
            },
          ]
        : activeProgress.xp;

      // Register session timestamp
      const newSessions = [...activeProgress.sessions, effectiveNow];

      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          [profileId]: {
            ...activeProgress,
            missions: newMissions,
            reviews: {
              ...activeProgress.reviews,
              [missionId]: updatedReview,
            },
            badges: newBadges,
            xp: newXpTransactions,
            sessions: newSessions,
            inFlight: null,
          },
        },
      }));

      return { xpAwarded: xpAmount, newBadge: earnedBadge };
    },
    [activeProfile, activeProgress, effectiveNow]
  );

  const completeReview = useCallback(
    (missionId: string): { xpAwarded: number } => {
      if (!activeProfile || !activeProgress) return { xpAwarded: 0 };
      const profileId = activeProfile.id;
      const review = activeProgress.reviews[missionId];
      if (!review) return { xpAwarded: 0 };

      const dedupeKey = `review-${profileId}-${missionId}-stage-${review.stage}-${Math.floor(effectiveNow / MS_PER_DAY)}`;
      const alreadyAwarded = activeProgress.xp.some((t) => t.id === dedupeKey);
      const xpAmount = alreadyAwarded ? 0 : 5;

      const nextStage = review.stage + 1;
      let nextDueAt = effectiveNow;
      let isRetained = false;

      if (nextStage === 1) {
        nextDueAt = effectiveNow + 3 * MS_PER_DAY;
      } else if (nextStage === 2) {
        nextDueAt = effectiveNow + 7 * MS_PER_DAY;
      } else {
        isRetained = true;
      }

      const updatedReview: ReviewItem = {
        ...review,
        stage: nextStage,
        dueAt: nextDueAt,
        retained: isRetained,
        lastReviewedAt: effectiveNow,
      };

      const updatedXp = xpAmount > 0
        ? [
            ...activeProgress.xp,
            {
              id: dedupeKey,
              amount: xpAmount,
              reason: "review" as const,
              at: effectiveNow,
            },
          ]
        : activeProgress.xp;

      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          [profileId]: {
            ...activeProgress,
            reviews: {
              ...activeProgress.reviews,
              [missionId]: updatedReview,
            },
            xp: updatedXp,
            sessions: [...activeProgress.sessions, effectiveNow],
          },
        },
      }));

      return { xpAwarded: xpAmount };
    },
    [activeProfile, activeProgress, effectiveNow]
  );

  const saveReflection = useCallback(
    (missionId: string, note: string) => {
      if (!activeProfile || !activeProgress || !note.trim()) return;
      const profileId = activeProfile.id;
      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          [profileId]: {
            ...activeProgress,
            reflections: [
              ...activeProgress.reflections.filter((r) => r.missionId !== missionId),
              { missionId, note: note.trim(), at: effectiveNow },
            ],
          },
        },
      }));
    },
    [activeProfile, activeProgress, effectiveNow]
  );

  const advanceDayOffset = useCallback((days: number) => {
    setState((prev) => ({
      ...prev,
      dayOffset: prev.dayOffset + days,
    }));
  }, []);

  const setDayOffset = useCallback((offset: number) => {
    setState((prev) => ({
      ...prev,
      dayOffset: offset,
    }));
  }, []);

  const toggleSimulateFailure = useCallback(() => {
    setState((prev) => ({
      ...prev,
      simulateFailure: !prev.simulateFailure,
    }));
  }, []);

  const resetDemo = useCallback(() => {
    clearStoredState();
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  const getMissionStatus = useCallback(
    (missionId: string): "completed" | "current" | "available" | "locked" | "coming-soon" => {
      if (!activeProgress) return "locked";
      const mission = akhlaqMissions.find((m) => m.id === missionId);
      if (!mission) return "coming-soon";

      if (activeProgress.missions[missionId]?.passedAt) {
        return "completed";
      }

      // Mission 1 is unlocked by default
      if (mission.order === 1) {
        return "current";
      }

      // Check prerequisite: previous mission must be completed
      const prevMission = akhlaqMissions.find((m) => m.order === mission.order - 1);
      if (prevMission && activeProgress.missions[prevMission.id]?.passedAt) {
        // Is it the very next uncompleted mission?
        return "current";
      }

      return "locked";
    },
    [activeProgress]
  );

  const getDueReviews = useCallback(() => {
    if (!activeProgress) return [];
    const results: { missionId: string; review: ReviewItem; missionTitle: { ml: string; en: string } }[] = [];

    for (const [missionId, rev] of Object.entries(activeProgress.reviews)) {
      if (!rev.retained && rev.dueAt <= effectiveNow) {
        const mission = akhlaqMissions.find((m) => m.id === missionId);
        if (mission) {
          results.push({
            missionId,
            review: rev,
            missionTitle: mission.title,
          });
        }
      }
    }
    return results;
  }, [activeProgress, effectiveNow]);

  const getTotalXp = useCallback(() => {
    if (!activeProgress) return 0;
    return activeProgress.xp.reduce((sum, tx) => sum + tx.amount, 0);
  }, [activeProgress]);

  const getCurrentLevel = useCallback(() => {
    if (!activeProgress) return 1;
    // Level formula: Level 1 + completed badges or 1 level per 2 completed missions
    const completedCount = Object.values(activeProgress.missions).filter((m) => m.passedAt).length;
    return Math.max(1, 1 + Math.floor(completedCount / 2));
  }, [activeProgress]);

  const getWeeklyProgressCount = useCallback(() => {
    if (!activeProgress) return 0;
    // Count distinct calendar days in the past 7 days up to effectiveNow
    const sevenDaysAgo = effectiveNow - 7 * MS_PER_DAY;
    const days = new Set<string>();
    for (const timestamp of activeProgress.sessions) {
      if (timestamp >= sevenDaysAgo && timestamp <= effectiveNow) {
        const d = new Date(timestamp);
        days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      }
    }
    return days.size;
  }, [activeProgress, effectiveNow]);

  const value = useMemo(
    (): NoorContextValue => ({
      state,
      activeProfile,
      activeProgress,
      lang,
      effectiveNow,
      setLang,
      toggleSound,
      toggleReducedMotion,
      setActiveProfileId,
      createProfile,
      deleteProfile,
      updateWeeklyGoal,
      updateAvatar,
      completeMission,
      completeReview,
      saveReflection,
      advanceDayOffset,
      setDayOffset,
      toggleSimulateFailure,
      resetDemo,
      getMissionStatus,
      getDueReviews,
      getTotalXp,
      getCurrentLevel,
      getWeeklyProgressCount,
    }),
    [
      state,
      activeProfile,
      activeProgress,
      lang,
      effectiveNow,
      setLang,
      toggleSound,
      toggleReducedMotion,
      setActiveProfileId,
      createProfile,
      deleteProfile,
      updateWeeklyGoal,
      updateAvatar,
      completeMission,
      completeReview,
      saveReflection,
      advanceDayOffset,
      setDayOffset,
      toggleSimulateFailure,
      resetDemo,
      getMissionStatus,
      getDueReviews,
      getTotalXp,
      getCurrentLevel,
      getWeeklyProgressCount,
    ]
  );

  return <NoorContext.Provider value={value}>{children}</NoorContext.Provider>;
};

export const useNoor = (): NoorContextValue => {
  const ctx = useContext(NoorContext);
  if (!ctx) {
    throw new Error("useNoor must be used within a NoorProvider");
  }
  return ctx;
};
