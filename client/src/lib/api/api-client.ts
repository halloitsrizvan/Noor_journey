/**
 * Typed API Client for Noor Journey REST API (/api/v1)
 * Supports HttpOnly cookie authentication, session-bound CSRF, and Idempotency keys.
 */

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://localhost:4000/api/v1";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
}

class ApiClient {
  private csrfToken: string | null = null;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers = new Headers(options.headers || {});

    // Ensure JSON
    if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
      headers.set("Content-Type", "application/json");
    }

    // Attach CSRF token on mutating methods
    const method = (options.method || "GET").toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (!this.csrfToken) {
        await this.fetchCsrfToken();
      }
      if (this.csrfToken) {
        headers.set("x-csrf-token", this.csrfToken);
      }
      if (!headers.has("idempotency-key") && method === "POST") {
        headers.set("idempotency-key", `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Sends HttpOnly session cookies
    });

    if (!response.ok) {
      let errData: any = {};
      try {
        errData = await response.json();
      } catch {
        // Response was not JSON
      }
      const apiError: ApiError = errData.error || {
        code: `HTTP_${response.status}`,
        message: errData.message || response.statusText || "Request failed",
      };
      throw apiError;
    }

    // Capture returned CSRF token if present
    const returnedCsrf = response.headers.get("x-csrf-token");
    if (returnedCsrf) {
      this.csrfToken = returnedCsrf;
    }

    return response.json();
  }

  async fetchCsrfToken(): Promise<string | null> {
    try {
      const data = await this.request<{ csrfToken: string }>("/auth/csrf");
      this.csrfToken = data.csrfToken;
      return this.csrfToken;
    } catch {
      return null;
    }
  }

  // Auth Endpoints
  auth = {
    register: async (email: string, password: string) => {
      const res = await this.request<{ account: any; csrfToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      this.csrfToken = res.csrfToken;
      return res;
    },
    login: async (email: string, password: string) => {
      const res = await this.request<{ account: any; csrfToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      this.csrfToken = res.csrfToken;
      return res;
    },
    logout: async () => {
      await this.request<{ success: boolean }>("/auth/logout", { method: "POST" });
      this.csrfToken = null;
    },
    logoutAll: async () => {
      await this.request<{ success: boolean }>("/auth/logout-all", { method: "POST" });
      this.csrfToken = null;
    },
    getMe: () => this.request<any>("/auth/me"),
    reauthenticate: (password: string) =>
      this.request<{ verified: boolean }>("/auth/reauthenticate", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
  };

  // Children Endpoints
  children = {
    list: () => this.request<any[]>("/children"),
    get: (id: string) => this.request<any>(`/children/${id}`),
    create: (data: {
      nickname: string;
      ageBand: string;
      preferredLanguage?: string;
      priorStandard?: string;
      avatarKey?: string;
      weeklyGoal?: number;
    }) =>
      this.request<any>("/children", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      this.request<any>(`/children/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<{ success: boolean }>(`/children/${id}`, {
        method: "DELETE",
      }),
    updateAvatar: (childId: string, avatarKey: string) =>
      this.request<any>(`/children/${childId}/avatar`, {
        method: "PATCH",
        body: JSON.stringify({ avatarKey }),
      }),
    syncStudent: (data: {
      nickname: string;
      email?: string | undefined;
      ageBand?: string | undefined;
      priorStandard?: string | undefined;
      avatarKey?: string | undefined;
      weeklyGoal?: number | undefined;
    }) =>
      this.request<any>("/children/sync-student", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getLeaderboard: () =>
      this.request<
        Array<{
          id: string;
          name: string;
          avatar: string;
          totalXp: number;
          stars: number;
          badgesCount: number;
          completedCount: number;
          createdAt: string;
          rank: number;
        }>
      >("/children/leaderboard"),
    getCollection: (childId: string) =>
      this.request<{ badges: any[]; avatars: any[] }>(`/children/${childId}/collection`),
  };

  // Content & Journey Endpoints
  content = {
    getWorlds: () => this.request<any[]>("/worlds"),
    getSubjects: () => this.request<any[]>("/subjects"),
    getChildJourney: (childId: string) =>
      this.request<any>(`/children/${childId}/journey`),
    getChildChapter: (childId: string, chapterId: string) =>
      this.request<any>(`/children/${childId}/chapters/${chapterId}`),
    getChildMission: (childId: string, missionId: string) =>
      this.request<any>(`/children/${childId}/missions/${missionId}`),
  };

  // Attempts & Grading Endpoints
  attempts = {
    createAttempt: (childId: string, missionId: string, versionId?: string) =>
      this.request<any>(`/children/${childId}/missions/${missionId}/attempts`, {
        method: "POST",
        body: JSON.stringify({ missionVersionId: versionId }),
      }),
    getAttempt: (childId: string, attemptId: string) =>
      this.request<any>(`/children/${childId}/attempts/${attemptId}`),
    submitActivity: (childId: string, attemptId: string, activityId: string, payload: any) =>
      this.request<{ isCorrect: boolean; feedback: { ml: string; en: string } }>(
        `/children/${childId}/attempts/${attemptId}/activities/${activityId}/submissions`,
        {
          method: "POST",
          body: JSON.stringify({ payload }),
        }
      ),
    createCheckpoint: (childId: string, attemptId: string) =>
      this.request<any>(`/children/${childId}/attempts/${attemptId}/checkpoints`, {
        method: "POST",
      }),
    submitCheckpointAnswer: (
      childId: string,
      checkpointId: string,
      questionId: string,
      choiceId: string
    ) =>
      this.request<{ isCorrect: boolean; feedback: { ml: string; en: string }; currentScore: number }>(
        `/children/${childId}/checkpoints/${checkpointId}/answers`,
        {
          method: "POST",
          body: JSON.stringify({ questionId, choiceId }),
        }
      ),
    finalizeCheckpoint: (
      childId: string,
      checkpointId: string,
      idempotencyKey?: string
    ) =>
      this.request<{
        passed: boolean;
        score: number;
        xpEarned: number;
        isFirstCompletion: boolean;
        newBadgeUnlocked: boolean;
        badge?: string;
        progressRevision: number;
      }>(`/children/${childId}/checkpoints/${checkpointId}/finalize`, {
        method: "POST",
        headers: idempotencyKey ? { "idempotency-key": idempotencyKey } : undefined,
        body: JSON.stringify({ idempotencyKey }),
      }),
  };

  // Revision & Rewards Endpoints
  reviews = {
    getDueReviews: (childId: string) =>
      this.request<any[]>(`/children/${childId}/reviews`),
    createReviewAttempt: (childId: string, reviewId: string) =>
      this.request<any>(`/children/${childId}/reviews/${reviewId}/attempts`, {
        method: "POST",
      }),
    submitReviewAnswers: (
      childId: string,
      attemptId: string,
      answers: { questionId: string; choiceId: string }[]
    ) =>
      this.request<any>(`/children/${childId}/review-attempts/${attemptId}/answers`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
    finalizeReview: (childId: string, attemptId: string, idempotencyKey?: string) =>
      this.request<{
        passed: boolean;
        xpEarned: number;
        retained: boolean;
        nextStage: number;
        nextDueAt: string;
      }>(`/children/${childId}/review-attempts/${attemptId}/finalize`, {
        method: "POST",
        headers: idempotencyKey ? { "idempotency-key": idempotencyKey } : undefined,
        body: JSON.stringify({ idempotencyKey }),
      }),
    getProgress: (childId: string) =>
      this.request<{
        totalXp: number;
        currentLevel: number;
        completedMissionsCount: number;
        weeklyGoal: number;
        weeklyCompletedSessions: number;
        weeklyActiveDays: number;
      }>(`/children/${childId}/progress`),
    getCollection: (childId: string) =>
      this.request<{ badges: any[]; avatars: any[] }>(`/children/${childId}/collection`),
    getLeaderboard: () =>
      this.request<
        Array<{
          id: string;
          name: string;
          avatar: string;
          totalXp: number;
          stars: number;
          badgesCount: number;
          completedCount: number;
          createdAt: string;
          rank: number;
        }>
      >("/children/leaderboard"),
  };

  // Reflections Endpoints
  reflections = {
    list: (childId: string) =>
      this.request<any[]>(`/children/${childId}/reflections`),
    create: (childId: string, missionId: string, note: string) =>
      this.request<any>(`/children/${childId}/reflections`, {
        method: "POST",
        body: JSON.stringify({ missionId, note }),
      }),
    delete: (childId: string, reflectionId: string) =>
      this.request<{ success: boolean }>(`/children/${childId}/reflections/${reflectionId}`, {
        method: "DELETE",
      }),
  };

  // Parent Reports
  reports = {
    getSummary: (childId: string) =>
      this.request<any>(`/children/${childId}/summary`),
  };

  // Health
  health = {
    checkLive: () => this.request<{ status: string }>("/health/live"),
    checkReady: () => this.request<{ status: string; database: string }>("/health/ready"),
  };

  // Editorial & Curriculum (Admin)
  editorial = {
    getOverview: () => this.request<any>("/editorial/overview"),
    review: (versionId: string, status: "APPROVED" | "REJECTED", comments?: string) =>
      this.request<any>(`/editorial/versions/${versionId}/review`, {
        method: "POST",
        body: JSON.stringify({ status, comments: comments || "Reviewed by administrator" }),
      }),
    publish: (versionId: string, releaseNotes?: string) =>
      this.request<any>(`/editorial/versions/${versionId}/publish`, {
        method: "POST",
        body: JSON.stringify({ releaseNotes: releaseNotes || "Published by administrator" }),
      }),
    archive: (versionId: string) =>
      this.request<any>(`/editorial/versions/${versionId}/archive`, {
        method: "POST",
      }),
    withdraw: (versionId: string) =>
      this.request<any>(`/editorial/versions/${versionId}/withdraw`, {
        method: "POST",
      }),
  };

  // Madrasa Subjects & Tajweed Curriculum (Dynamic DB & Multi-Qari Audio)
  madrasa = {
    getSubjects: () =>
      this.request<
        Array<{
          id: string;
          key: string;
          titleMl: string;
          titleEn: string;
          arabicTitle: string;
          descMl: string;
          descEn: string;
          badgeText: string;
          gradient: string;
          bgLight: string;
          textColor: string;
          accentColor: string;
          topicsCount: number;
          displayOrder: number;
          topics: Array<{
            id: string;
            subjectId: string;
            titleMl: string;
            titleEn: string;
            arabicTitle?: string;
            description?: string;
            order: number;
            xpReward: number;
            durationMinutes: number;
            isPublished: boolean;
            iconName?: string;
          }>;
        }>
      >("/madrasa/subjects"),

    getSubjectByKey: (key: string) =>
      this.request<any>(`/madrasa/subjects/${key}`),

    createSubject: (data: any) =>
      this.request<any>("/madrasa/subjects", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateSubject: (id: string, data: any) =>
      this.request<any>(`/madrasa/subjects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteSubject: (id: string) =>
      this.request<{ success: boolean; message: string }>(`/madrasa/subjects/${id}`, {
        method: "DELETE",
      }),

    createTopic: (subjectId: string, data: any) =>
      this.request<any>(`/madrasa/subjects/${subjectId}/topics`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateTopic: (topicId: string, data: any) =>
      this.request<any>(`/madrasa/topics/${topicId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteTopic: (topicId: string) =>
      this.request<{ success: boolean; message: string }>(`/madrasa/topics/${topicId}`, {
        method: "DELETE",
      }),

    getFatihah: () =>
      this.request<any[]>("/madrasa/fatihah"),

    updateFatihahVerse: (verseId: string, data: any) =>
      this.request<any>(`/madrasa/fatihah/${verseId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    getReciters: () =>
      this.request<
        Array<{
          id: string;
          reciterId: number;
          nameEnglish: string;
          nameArabic: string;
          nameMalayalam: string;
          style: string;
          serverSubfolder: string;
          avatarUrl: string;
        }>
      >("/madrasa/quran/reciters"),

    getFatihahAudio: (reciter?: string) =>
      this.request<{
        surah: number;
        surahName: string;
        reciter: {
          id: string;
          nameEnglish: string;
          nameArabic: string;
          nameMalayalam: string;
          style: string;
        };
        audioFiles: Array<{
          verseNumber: number;
          verseKey: string;
          audioUrl: string;
          duration?: number;
        }>;
      }>(`/madrasa/quran/fatihah/audio${reciter ? `?reciter=${reciter}` : ""}`),
  };
}

export const api = new ApiClient();
