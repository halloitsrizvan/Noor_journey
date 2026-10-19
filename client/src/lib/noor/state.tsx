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
import { api } from "@/lib/api/api-client";
import { sfx } from "@/lib/sound/sfx";

export interface NoorContextValue {
  state: NoorState;
  activeProfile: ChildProfile | null;
  activeProgress: ChildProgress | null;
  lang: Lang;
  effectiveNow: number;
  isBackendConnected: boolean;
  authAccount: any | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLang: (lang: Lang) => void;
  setLanguage: (lang: Lang) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  setActiveProfileId: (id: string) => void;
  loginStudent: (data: {
    nickname?: string;
    email: string;
    password?: string;
    ageBand?: AgeBand;
    priorStandard?: PriorStandard;
  }) => Promise<{ success: boolean; error?: string; profileId?: string }>;
  registerStudent: (data: {
    nickname: string;
    email: string;
    password?: string;
    ageBand?: AgeBand;
    priorStandard?: PriorStandard;
    avatarId?: string;
    weeklyGoal?: 2 | 3 | 5;
  }) => Promise<{ success: boolean; error?: string; profileId?: string }>;
  createProfile: (data: {
    nickname: string;
    email?: string;
    password?: string;
    ageBand: AgeBand;
    priorStandard: PriorStandard;
    avatarId: string;
    avatarUrl?: string | null;
    weeklyGoal: 2 | 3 | 5;
  }) => string;
  deleteProfile: (id: string) => void;
  deleteAllStudents: () => void;
  updateWeeklyGoal: (goal: 2 | 3 | 5) => void;
  updateAvatar: (avatarId: string) => void;
  updateProfileImage: (avatarUrl: string | null) => void;
  updateStudentDetails: (details: {
    ageBand: AgeBand;
    priorStandard: PriorStandard;
    avatarId?: string | undefined;
    avatarUrl?: string | null | undefined;
  }) => void;
  awardXp: (
    amount: number,
    reason?: "mission" | "review" | "chapter-review" | "tajweed" | "quiz" | "activity" | "fatihah",
    dedupeKey?: string
  ) => number;
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
  getNoorStars: () => number;
  getCurrentLevel: () => number;
  getWeeklyProgressCount: () => number;
}

const NoorContext = createContext<NoorContextValue | null>(null);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function loadStoredAuthAccount(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("noor_auth_account");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const NoorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NoorState>(() => loadStoredState());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [authAccount, setAuthAccount] = useState<any | null>(() => loadStoredAuthAccount());

  // Probe backend health and validate session
  useEffect(() => {
    let mounted = true;
    async function checkBackend() {
      // 1. Health probe
      try {
        const live = await api.health.checkLive();
        if (mounted && live?.status === "ok") {
          setIsBackendConnected(true);
        }
      } catch {
        if (mounted) setIsBackendConnected(false);
      }

      // 2. Validate/refresh session if we have a token or cached account
      const token = api.getSessionToken();
      const cached = loadStoredAuthAccount();
      if (token || cached) {
        try {
          const me = await api.auth.getMe();
          if (mounted && me?.id) {
            setAuthAccount(me);
            if (typeof window !== "undefined") {
              localStorage.setItem("noor_auth_account", JSON.stringify(me));
            }
          }
        } catch (err: any) {
          // If session expired or was revoked on the server, clear authentication
          const code = err?.code;
          if (
            mounted &&
            (code === "HTTP_401" ||
              code === "UNAUTHORIZED" ||
              code === "SESSION_REVOKED" ||
              code === "SESSION_EXPIRED" ||
              code === "ACCOUNT_NOT_FOUND")
          ) {
            setAuthAccount(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("noor_auth_account");
              localStorage.removeItem("noor_auth_token");
            }
          }
        }
      }

      // 3. Restore and sync active student profile & progress directly from database
      const savedStudentEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("noor_active_student_email") ||
            sessionStorage.getItem("noor_active_student_email")
          : null;

      if (savedStudentEmail) {
        try {
          const res = await api.children.getStudentProfile(savedStudentEmail);
          if (mounted && res?.success && res.student) {
            const s = res.student;
            const restoredProfile: ChildProfile = {
              id: s.id,
              nickname: s.nickname || "Explorer",
              email: s.email || savedStudentEmail,
              ageBand: (s.ageBand || "8-9") as AgeBand,
              priorStandard: (s.priorStandard || "3") as PriorStandard,
              avatarId: s.avatarId || "lantern-noor",
              avatarUrl: s.avatarUrl || null,
              cosmeticId: null,
              weeklyGoal: (s.weeklyGoal || 3) as 2 | 3 | 5,
              recommendedStart: "akhlaq-small-actions",
              createdAt: Date.now(),
            };

            const restoredProgress: ChildProgress = s.progress || createInitialProgress();

            setState((prev) => {
              const otherProfiles = prev.profiles.filter(
                (p) => p.id !== s.id && (!p.email || p.email.toLowerCase() !== s.email?.toLowerCase())
              );
              return {
                ...prev,
                profiles: [restoredProfile, ...otherProfiles],
                activeProfileId: s.id,
                progress: {
                  ...prev.progress,
                  [s.id]: {
                    ...(prev.progress[s.id] || {}),
                    ...(restoredProgress || {}),
                  },
                },
              };
            });
          }
        } catch {}
      }
    }
    checkBackend();
    return () => {
      mounted = false;
    };
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    saveStoredState(state);
    sfx.setEnabled(state.prefs.sound);
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
    const prog = state.progress[activeProfile.id];
    if (!prog) return null;
    return {
      missions: prog.missions || {},
      reviews: prog.reviews || {},
      xp: Array.isArray(prog.xp) ? prog.xp : [],
      badges: Array.isArray(prog.badges) ? prog.badges : [],
      chapterReviews: prog.chapterReviews || {},
      sessions: Array.isArray(prog.sessions) ? prog.sessions : [],
      inFlight: prog.inFlight ?? null,
      reflections: Array.isArray(prog.reflections) ? prog.reflections : [],
    };
  }, [state.progress, activeProfile]);

  // Auto-sync active student progress & avatar to central cloud database (debounced 1.5s)
  useEffect(() => {
    if (!activeProfile || !activeProgress) return;
    const timer = setTimeout(() => {
      api.children
        .syncProgress({
          studentEmail: activeProfile.email,
          profileId: activeProfile.id,
          progress: activeProgress,
          avatarUrl: activeProfile.avatarUrl,
          avatarKey: activeProfile.avatarId,
        })
        .catch(() => {});
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    activeProfile?.id,
    activeProfile?.email,
    activeProfile?.avatarUrl,
    activeProfile?.avatarId,
    activeProgress,
  ]);

  const login = useCallback(async (email: string, pass: string) => {
    try {
      const res = await api.auth.login(email, pass);
      setAuthAccount(res.account);
      if (typeof window !== "undefined") {
        localStorage.setItem("noor_auth_account", JSON.stringify(res.account));
      }
      // Fetch server children if any
      const serverChildren = await api.children.list();
      if (serverChildren && serverChildren.length > 0) {
        setState((prev) => ({
          ...prev,
          profiles: serverChildren.map((c: any) => ({
            id: c.id,
            nickname: c.nickname,
            ageBand: c.ageBand as AgeBand,
            priorStandard: (c.priorStandard || "none") as PriorStandard,
            avatarId: c.avatarKey || "lantern-noor",
            cosmeticId: null,
            weeklyGoal: c.weeklyGoal as 2 | 3 | 5,
            createdAt: new Date(c.createdAt).getTime(),
          })),
          activeProfileId: serverChildren[0].id,
        }));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    }
  }, []);

  const register = useCallback(async (email: string, pass: string) => {
    try {
      const res = await api.auth.register(email, pass);
      setAuthAccount(res.account);
      if (typeof window !== "undefined") {
        localStorage.setItem("noor_auth_account", JSON.stringify(res.account));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    setAuthAccount(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("noor_auth_account");
      localStorage.removeItem("noor_auth_token");
    }
  }, []);

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
      email?: string;
      password?: string;
      ageBand: AgeBand;
      priorStandard: PriorStandard;
      avatarId: string;
      avatarUrl?: string | null;
      weeklyGoal: 2 | 3 | 5;
    }) => {
      const cleanEmail = data.email?.trim().toLowerCase();
      if (cleanEmail) {
        const existing = state.profiles.find(
          (p) => p.email && p.email.toLowerCase() === cleanEmail
        );
        if (existing) {
          throw new Error("An account with this email address already exists.");
        }
      }

      const id = `profile-${Date.now()}`;
      const newProfile: ChildProfile = {
        id,
        nickname: data.nickname || "കുട്ടി",
        email: cleanEmail,
        password: data.password,
        ageBand: data.ageBand,
        priorStandard: data.priorStandard,
        avatarId: data.avatarId || "lantern-noor",
        avatarUrl: data.avatarUrl || null,
        cosmeticId: null,
        weeklyGoal: data.weeklyGoal,
        recommendedStart: "akhlaq-small-actions",
        createdAt: effectiveNow,
      };

      // Always sync creation to central backend database
      api.children
        .syncStudent({
          nickname: newProfile.nickname,
          email: newProfile.email,
          password: newProfile.password,
          ageBand: newProfile.ageBand,
          priorStandard: newProfile.priorStandard,
          avatarKey: newProfile.avatarId,
          avatarUrl: newProfile.avatarUrl,
          weeklyGoal: newProfile.weeklyGoal,
          progress: createInitialProgress(),
        })
        .then((dbStudent: any) => {
          if (dbStudent && dbStudent.id) {
            setState((prev) => ({
              ...prev,
              profiles: prev.profiles.map((p) =>
                p.id === id ? { ...p, id: dbStudent.id } : p
              ),
              activeProfileId: prev.activeProfileId === id ? dbStudent.id : prev.activeProfileId,
              progress: {
                ...prev.progress,
                [dbStudent.id]: prev.progress[id] || createInitialProgress(),
              },
            }));
          }
        })
        .catch(() => {});

      if (isBackendConnected && authAccount) {
        api.children
          .create({
            nickname: newProfile.nickname,
            ageBand: newProfile.ageBand,
            preferredLanguage: "ml",
            priorStandard: newProfile.priorStandard,
            avatarKey: newProfile.avatarId,
            weeklyGoal: newProfile.weeklyGoal,
          })
          .catch(() => {});
      }

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
    [effectiveNow, isBackendConnected, authAccount, state.profiles]
  );

  const loginStudent = useCallback(
    async (data: {
      nickname?: string;
      email: string;
      password?: string;
      ageBand?: AgeBand;
      priorStandard?: PriorStandard;
    }): Promise<{ success: boolean; error?: string; profileId?: string }> => {
      const cleanEmail = data.email?.trim().toLowerCase();
      if (!cleanEmail) {
        return {
          success: false,
          error: "Please enter your email.",
        };
      }

      const cleanName = data.nickname?.trim();

      // 1. First check local storage profiles
      let existing = state.profiles.find(
        (p) =>
          (p.email && p.email.toLowerCase() === cleanEmail) ||
          (cleanName && p.nickname.toLowerCase() === cleanName.toLowerCase())
      );

      // 2. If not found in local storage (e.g. in production or on another device), query central database!
      if (!existing) {
        try {
          const res = await api.children.studentLogin({
            email: cleanEmail,
            password: data.password,
          });

          if (res?.success && res.student) {
            const s = res.student;
            const newProfile: ChildProfile = {
              id: s.id,
              nickname: s.nickname || "Explorer",
              email: s.email || cleanEmail,
              password: data.password,
              ageBand: (s.ageBand || "10-11") as AgeBand,
              priorStandard: (s.priorStandard || "none") as PriorStandard,
              avatarId: s.avatarId || "lantern-noor",
              avatarUrl: s.avatarUrl || null,
              cosmeticId: null,
              weeklyGoal: (s.weeklyGoal || 3) as 2 | 3 | 5,
              recommendedStart: "akhlaq-small-actions",
              createdAt: Date.now(),
            };

            const restoredProgress: ChildProgress = s.progress || createInitialProgress();

            setState((prev) => ({
              ...prev,
              profiles: [...prev.profiles.filter((p) => p.id !== s.id), newProfile],
              activeProfileId: s.id,
              progress: {
                ...prev.progress,
                [s.id]: restoredProgress,
              },
            }));

            return { success: true, profileId: s.id };
          } else if (res?.error) {
            return { success: false, error: res.error };
          }
        } catch (err: any) {
          return {
            success: false,
            error:
              err?.message ||
              "Unable to reach the server. Please check your network or ensure the backend is active.",
          };
        }

        return {
          success: false,
          error: "No student account found with this email. Please check your email or create an account.",
        };
      }

      // Check password if profile has a password stored
      if (existing.password && data.password && existing.password !== data.password) {
        return {
          success: false,
          error: "Incorrect password. Please verify your password and try again.",
        };
      }

      // Switch active profile
      setState((prev) => ({
        ...prev,
        activeProfileId: existing.id,
        profiles: prev.profiles.map((p) =>
          p.id === existing.id
            ? {
                ...p,
                email: cleanEmail || p.email,
                ageBand: data.ageBand || p.ageBand,
                priorStandard: data.priorStandard || p.priorStandard,
              }
            : p
        ),
      }));

      // Background sync latest progress and avatar from database if available
      api.children
        .studentLogin({ email: cleanEmail, password: data.password })
        .then((res) => {
          if (res?.success && res.student) {
            setState((prev) => ({
              ...prev,
              profiles: prev.profiles.map((p) =>
                p.id === existing.id
                  ? {
                      ...p,
                      avatarUrl: res.student.avatarUrl !== undefined ? res.student.avatarUrl : p.avatarUrl,
                      avatarId: res.student.avatarId || p.avatarId,
                    }
                  : p
              ),
              progress: res.student.progress
                ? {
                    ...prev.progress,
                    [existing.id]: {
                      ...(prev.progress[existing.id] || {}),
                      ...res.student.progress,
                    },
                  }
                : prev.progress,
            }));
          }
        })
        .catch(() => {});

      return { success: true, profileId: existing.id };
    },
    [state.profiles]
  );

  const registerStudent = useCallback(
    async (data: {
      nickname: string;
      email: string;
      password?: string;
      ageBand?: AgeBand;
      priorStandard?: PriorStandard;
      avatarId?: string;
      weeklyGoal?: 2 | 3 | 5;
    }): Promise<{ success: boolean; error?: string; profileId?: string }> => {
      const cleanEmail = data.email?.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: "Please enter your email." };
      }

      // 1. Check local profiles
      const localExists = state.profiles.some(
        (p) => p.email && p.email.toLowerCase() === cleanEmail
      );
      if (localExists) {
        return {
          success: false,
          error: "An account with this email address already exists. Please log in instead.",
        };
      }

      // 2. Validate with central database and register
      try {
        const res = await api.children.studentRegister({
          nickname: data.nickname,
          email: cleanEmail,
          password: data.password,
          ageBand: data.ageBand || "8-9",
          priorStandard: data.priorStandard || "3",
          avatarKey: data.avatarId || "lantern-noor",
          weeklyGoal: data.weeklyGoal || 3,
        });

        if (!res.success) {
          return { success: false, error: res.error || "Registration failed." };
        }

        const s = res.student;
        const newProfile: ChildProfile = {
          id: s.id,
          nickname: s.nickname || data.nickname,
          email: cleanEmail,
          password: data.password,
          ageBand: (s.ageBand || data.ageBand || "8-9") as AgeBand,
          priorStandard: (s.priorStandard || data.priorStandard || "3") as PriorStandard,
          avatarId: s.avatarId || data.avatarId || "lantern-noor",
          avatarUrl: s.avatarUrl || null,
          cosmeticId: null,
          weeklyGoal: (s.weeklyGoal || data.weeklyGoal || 3) as 2 | 3 | 5,
          recommendedStart: "akhlaq-small-actions",
          createdAt: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          profiles: [...prev.profiles.filter((p) => p.email !== cleanEmail), newProfile],
          activeProfileId: newProfile.id,
          progress: {
            ...prev.progress,
            [newProfile.id]: createInitialProgress(),
          },
        }));

        return { success: true, profileId: newProfile.id };
      } catch (err: any) {
        return {
          success: false,
          error:
            err?.message ||
            "Unable to connect to the server. Please verify your connection and try again.",
        };
      }
    },
    [state.profiles]
  );

  const deleteProfile = useCallback((id: string) => {
    if (isBackendConnected && authAccount) {
      api.children.delete(id).catch(() => {});
    }
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
  }, [isBackendConnected, authAccount]);

  const deleteAllStudents = useCallback(() => {
    setState((prev) => ({
      ...prev,
      profiles: [],
      activeProfileId: null as any,
      progress: {},
    }));
    try {
      localStorage.removeItem("noor_journey_state_v1");
      localStorage.removeItem("noor_journey_state_v2");
      sessionStorage.removeItem("noor_active_student_session");
      sessionStorage.removeItem("noor_active_student_email");
      localStorage.removeItem("noor_active_student_session");
      localStorage.removeItem("noor_active_student_name");
      localStorage.removeItem("noor_active_student_email");
    } catch {}
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
    if (isBackendConnected && authAccount && state.activeProfileId) {
      api.children.updateAvatar(state.activeProfileId, avatarId).catch(() => {});
    }
    setState((prev) => {
      if (!prev.activeProfileId) return prev;
      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, avatarId } : p
        ),
      };
    });
  }, [isBackendConnected, authAccount, state.activeProfileId]);

  const updateProfileImage = useCallback((avatarUrl: string | null) => {
    setState((prev) => {
      if (!prev.activeProfileId) return prev;
      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, avatarUrl } : p
        ),
      };
    });
  }, []);

  const updateStudentDetails = useCallback(
    (details: {
      ageBand: AgeBand;
      priorStandard: PriorStandard;
      avatarId?: string | undefined;
      avatarUrl?: string | null | undefined;
    }) => {
      setState((prev) => {
        if (!prev.activeProfileId) return prev;
        return {
          ...prev,
          profiles: prev.profiles.map((p) =>
            p.id === prev.activeProfileId
              ? {
                  ...p,
                  ageBand: details.ageBand,
                  priorStandard: details.priorStandard,
                  avatarId: details.avatarId || p.avatarId,
                  avatarUrl: details.avatarUrl !== undefined ? details.avatarUrl : p.avatarUrl,
                }
              : p
          ),
        };
      });

      if (details.avatarId) {
        updateAvatar(details.avatarId);
      }
      if (details.avatarUrl !== undefined) {
        updateProfileImage(details.avatarUrl);
      }
    },
    [updateAvatar, updateProfileImage]
  );

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

  const awardXp = useCallback(
    (
      amount: number,
      reason: "mission" | "review" | "chapter-review" | "tajweed" | "quiz" | "activity" | "fatihah" = "activity",
      dedupeKey?: string
    ): number => {
      if (!activeProfile || amount <= 0) return 0;
      const profileId = activeProfile.id;
      const finalDedupeKey =
        dedupeKey || `xp-${profileId}-${reason}-${effectiveNow}-${Math.random().toString(36).slice(2, 7)}`;

      let actualAwarded = 0;
      setState((prev) => {
        const currentProg = prev.progress[profileId] || createInitialProgress();
        const currentXp = Array.isArray(currentProg.xp) ? currentProg.xp : [];
        const alreadyAwarded = currentXp.some((tx) => tx.id === finalDedupeKey);
        if (alreadyAwarded) {
          return prev;
        }

        actualAwarded = amount;
        const newTx: XpTransaction = {
          id: finalDedupeKey,
          amount,
          reason,
          at: effectiveNow,
        };

        const currentSessions = Array.isArray(currentProg.sessions) ? currentProg.sessions : [];

        return {
          ...prev,
          progress: {
            ...prev.progress,
            [profileId]: {
              ...currentProg,
              xp: [...currentXp, newTx],
              sessions: [...currentSessions, effectiveNow],
            },
          },
        };
      });

      return actualAwarded;
    },
    [activeProfile, effectiveNow]
  );

  const saveReflection = useCallback(
    (missionId: string, note: string) => {
      if (!activeProfile || !activeProgress || !note.trim()) return;
      const profileId = activeProfile.id;

      if (isBackendConnected && authAccount) {
        api.reflections.create(profileId, missionId, note.trim()).catch(() => {});
      }

      const dedupeKey = `reflection-${profileId}-${missionId}`;
      const alreadyXp = activeProgress.xp.some((t) => t.id === dedupeKey);
      const newXpTransactions = alreadyXp
        ? activeProgress.xp
        : [
            ...activeProgress.xp,
            {
              id: dedupeKey,
              amount: 5,
              reason: "activity" as const,
              at: effectiveNow,
            },
          ];

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
            xp: newXpTransactions,
          },
        },
      }));
    },
    [activeProfile, activeProgress, effectiveNow, isBackendConnected, authAccount]
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

      if (mission.order === 1) {
        return "current";
      }

      const prevMission = akhlaqMissions.find((m) => m.order === mission.order - 1);
      if (prevMission && activeProgress.missions[prevMission.id]?.passedAt) {
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

  const getNoorStars = useCallback(() => {
    return Math.floor(getTotalXp() / 10);
  }, [getTotalXp]);

  const getCurrentLevel = useCallback(() => {
    if (!activeProgress) return 1;
    const completedCount = Object.values(activeProgress.missions).filter((m) => m.passedAt).length;
    return Math.max(1, 1 + Math.floor(completedCount / 2));
  }, [activeProgress]);

  const getWeeklyProgressCount = useCallback(() => {
    if (!activeProgress) return 0;
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
      isBackendConnected,
      authAccount,
      login,
      register,
      logout,
      setLang,
      setLanguage: setLang,
      toggleSound,
      toggleReducedMotion,
      setActiveProfileId,
      loginStudent,
      registerStudent,
      createProfile,
      deleteProfile,
      deleteAllStudents,
      updateWeeklyGoal,
      updateAvatar,
      updateProfileImage,
      updateStudentDetails,
      awardXp,
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
      getNoorStars,
      getCurrentLevel,
      getWeeklyProgressCount,
    }),
    [
      state,
      activeProfile,
      activeProgress,
      lang,
      effectiveNow,
      isBackendConnected,
      authAccount,
      login,
      register,
      logout,
      setLang,
      toggleSound,
      toggleReducedMotion,
      setActiveProfileId,
      loginStudent,
      registerStudent,
      createProfile,
      deleteProfile,
      deleteAllStudents,
      updateWeeklyGoal,
      updateAvatar,
      updateProfileImage,
      updateStudentDetails,
      awardXp,
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
