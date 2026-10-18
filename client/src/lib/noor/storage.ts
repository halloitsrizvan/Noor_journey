import type { ChildProfile, ChildProgress, NoorState } from "./types";

const STORAGE_KEY = "noor_journey_state_v2";

export function createDefaultProfile(): ChildProfile {
  return {
    id: "profile-demo-1",
    nickname: "Amina",
    ageBand: "10-11",
    priorStandard: "4",
    avatarId: "lantern-noor",
    cosmeticId: null,
    weeklyGoal: 3,
    recommendedStart: "akhlaq-small-actions",
    createdAt: Date.now(),
  };
}

export function createInitialProgress(): ChildProgress {
  return {
    missions: {},
    reviews: {},
    xp: [],
    badges: [],
    chapterReviews: {},
    sessions: [Date.now() - 24 * 60 * 60 * 1000],
    inFlight: null,
    reflections: [],
  };
}

export function createInitialState(): NoorState {
  return {
    version: 1,
    parentName: "Parent",
    profiles: [],
    activeProfileId: "",
    progress: {},
    prefs: {
      lang: "en",
      sound: true,
      reducedMotion: false,
    },
    dayOffset: 0,
    simulateFailure: false,
  };
}

export function loadStoredState(): NoorState {
  if (typeof window === "undefined") {
    return createInitialState();
  }
  try {
    // Clear legacy v1 state if present
    localStorage.removeItem("noor_journey_state_v1");

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.profiles)) {
      const cleanedProfiles = parsed.profiles.filter(
        (p: any) =>
          p &&
          p.nickname &&
          !["rizzo", "സയാൻ", "amina"].includes(p.nickname.trim().toLowerCase())
      );
      return {
        ...parsed,
        profiles: cleanedProfiles,
        activeProfileId: cleanedProfiles[0]?.id || "",
      } as NoorState;
    }
    return createInitialState();
  } catch (err) {
    console.warn("Failed to read from localStorage, using initial state:", err);
    return createInitialState();
  }
}

export function saveStoredState(state: NoorState): boolean {
  if (typeof window === "undefined") return false;
  if (state.simulateFailure) {
    console.warn("Simulated network/storage failure is ACTIVE in demo settings.");
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error("Failed to write to localStorage:", err);
    return false;
  }
}

export function clearStoredState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear localStorage:", err);
  }
}
