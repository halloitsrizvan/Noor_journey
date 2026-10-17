/**
 * Noor Journey Session & Cookie Manager
 * Manages client-side session cookies (SameSite=Lax) alongside Web Storage
 * to ensure persistent authentication across routes, page reloads, and tabs.
 */

const SESSION_COOKIE_NAME = "noor_student_session";
const STUDENT_NAME_COOKIE = "noor_active_student";
const STUDENT_EMAIL_COOKIE = "noor_active_student_email";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setStudentSession(studentName: string, studentEmail?: string): void {
  if (typeof window === "undefined") return;

  // 1. Set Session Cookie
  document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${STUDENT_NAME_COOKIE}=${encodeURIComponent(
    studentName
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

  if (studentEmail) {
    document.cookie = `${STUDENT_EMAIL_COOKIE}=${encodeURIComponent(
      studentEmail
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }

  // 2. Set Session & Local Storage fallbacks
  try {
    sessionStorage.setItem("noor_active_student_session", "true");
    localStorage.setItem("noor_active_student_session", "true");
    localStorage.setItem("noor_active_student_name", studentName);
    if (studentEmail) {
      localStorage.setItem("noor_active_student_email", studentEmail);
      sessionStorage.setItem("noor_active_student_email", studentEmail);
    }
  } catch {}
}

export function isStudentSessionActive(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Check Cookie
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const hasCookie = cookies.some((c) => c.startsWith(`${SESSION_COOKIE_NAME}=true`));
  if (hasCookie) return true;

  // 2. Check SessionStorage
  try {
    if (sessionStorage.getItem("noor_active_student_session") === "true") {
      return true;
    }
  } catch {}

  // 3. Check LocalStorage
  try {
    if (localStorage.getItem("noor_active_student_session") === "true") {
      return true;
    }
  } catch {}

  return false;
}

export function getActiveStudentName(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const nameCookie = cookies.find((c) => c.startsWith(`${STUDENT_NAME_COOKIE}=`));
  if (nameCookie) {
    try {
      return decodeURIComponent(nameCookie.split("=")[1]);
    } catch {}
  }

  try {
    return localStorage.getItem("noor_active_student_name");
  } catch {}

  return null;
}

export function getActiveStudentEmail(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const emailCookie = cookies.find((c) => c.startsWith(`${STUDENT_EMAIL_COOKIE}=`));
  if (emailCookie) {
    try {
      return decodeURIComponent(emailCookie.split("=")[1]);
    } catch {}
  }

  try {
    return (
      localStorage.getItem("noor_active_student_email") ||
      sessionStorage.getItem("noor_active_student_email")
    );
  } catch {}

  return null;
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;

  // 1. Expire cookies
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${STUDENT_NAME_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${STUDENT_EMAIL_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  // 2. Clear storages
  try {
    sessionStorage.removeItem("noor_active_student_session");
    sessionStorage.removeItem("noor_active_student_email");
    localStorage.removeItem("noor_active_student_session");
    localStorage.removeItem("noor_active_student_name");
    localStorage.removeItem("noor_active_student_email");
  } catch {}
}
