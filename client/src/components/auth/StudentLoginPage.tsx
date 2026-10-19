import React, { useState } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { BrandWordmark } from "@/components/common/BrandWordmark";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { setStudentSession } from "@/lib/noor/session";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface StudentLoginPageProps {
  onEnterChildSpace: () => void;
  onBackToWelcome: () => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onEnterChildSpace,
  onBackToWelcome,
}) => {
  const { lang, state, activeProfile, loginStudent, registerStudent, createProfile } = useNoor();

  // Auth Mode: "login" | "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Form Fields
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) {
      setErrorMessage(lang === "ml" ? "ദയവായി ഇമെയിൽ നൽകുക" : "Please enter your email.");
      return;
    }
    if (!studentPassword.trim()) {
      setErrorMessage(lang === "ml" ? "ദയവായി പാസ്‌വേഡ് നൽകുക" : "Please enter your password.");
      return;
    }

    setErrorMessage(null);
    setIsLoggingIn(true);

    try {
      const cleanEmail = studentEmail.trim().toLowerCase();

      const res = await loginStudent({
        email: cleanEmail,
        password: studentPassword,
      });

      if (!res.success) {
        setErrorMessage(
          lang === "ml"
            ? res.error?.includes("password") || res.error?.includes("Incorrect")
              ? "തെറ്റായ പാസ്‌വേഡ് നൽകി. ദയവായി വീണ്ടും ശ്രമിക്കുക."
              : res.error?.includes("reach the server") || res.error?.includes("network")
              ? "സെർവറുമായി ബന്ധപ്പെടാൻ സാധിക്കുന്നില്ല. ദയവായി അല്പം കഴിഞ്ഞ് ശ്രമിക്കുക."
              : "ഈ ഇമെയിൽ വിലാസത്തിൽ അക്കൗണ്ട് കണ്ടെത്താനായില്ല. ദയവായി അക്കൗണ്ട് ഉണ്ടാക്കുക."
            : res.error || "No student account found with this email. Please check your email or create an account."
        );
        return;
      }

      // Success! Lookup student nickname from registered profile
      const profile = state.profiles.find((p) => p.id === res.profileId) || activeProfile;
      const derivedName = profile?.nickname || cleanEmail.split("@")[0] || "Explorer";

      setStudentSession(derivedName, cleanEmail);
      onEnterChildSpace();
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Signup: Enter Account Details -> Enforce unique email in database -> jump to dashboard & popup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage(lang === "ml" ? "ദയവായി വിദ്യാർത്ഥിയുടെ പേര് നൽകുക" : "Please enter your name.");
      return;
    }
    if (!studentEmail.trim() || !studentEmail.includes("@")) {
      setErrorMessage(lang === "ml" ? "സാധുവായ ഒരു ഇമെയിൽ നൽകുക" : "Please enter a valid email address.");
      return;
    }
    if (studentPassword.length < 3) {
      setErrorMessage(lang === "ml" ? "പാസ്‌വേഡ് നൽകുക (കുറഞ്ഞത് 3 അക്ഷരങ്ങൾ)" : "Password must be at least 3 characters.");
      return;
    }

    setErrorMessage(null);
    setIsLoggingIn(true);

    const cleanName = studentName.trim();
    const cleanEmail = studentEmail.trim().toLowerCase();

    // 1. Security Check: Enforce email uniqueness locally first
    const emailAlreadyExistsLocal = state.profiles.some(
      (p) => p.email && p.email.toLowerCase() === cleanEmail
    );
    if (emailAlreadyExistsLocal) {
      setIsLoggingIn(false);
      setErrorMessage(
        lang === "ml"
          ? "ഈ ഇമെയിൽ വിലാസത്തിൽ ഇതിനകം ഒരു അക്കൗണ്ട് നിലവിലുണ്ട്. ദയവായി ലോഗിൻ ചെയ്യുക."
          : "An account with this email address already exists. Please sign in instead."
      );
      return;
    }

    try {
      // 2. Validate with central database and register learner
      const res = await registerStudent({
        nickname: cleanName,
        email: cleanEmail,
        password: studentPassword,
        ageBand: "8-9",
        priorStandard: "3",
        avatarId: "lantern-noor",
        weeklyGoal: 3,
      });

      if (!res.success) {
        setErrorMessage(
          lang === "ml" && (res.error?.includes("already exists") || res.error?.includes("നിലവിലുണ്ട്"))
            ? "ഈ ഇമെയിൽ വിലാസത്തിൽ ഇതിനകം ഒരു അക്കൗണ്ട് നിലവിലുണ്ട്. ദയവായി ലോഗിൻ ചെയ്യുക."
            : res.error || "Failed to create account."
        );
        return;
      }

      setStudentSession(cleanName, cleanEmail);

      // Flag to trigger the bottom-to-center popup on dashboard
      try {
        sessionStorage.setItem("noor_show_child_onboarding_popup", "true");
      } catch {}

      onEnterChildSpace();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col justify-between p-5 sm:p-8 max-w-md sm:max-w-xl mx-auto overflow-hidden">
      {/* Header */}
      <header className="w-full flex items-center justify-between pb-3">
        <BrandWordmark size="md" />
        <LanguageSwitcher />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-4">
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center animate-pop">
          {/* Back Navigation & Page Title */}
          <div className="mb-4 text-left">
            <button
              type="button"
              onClick={onBackToWelcome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#626273] hover:text-[#141426] mb-2 tactile px-2 py-1 rounded-full hover:bg-[#F3F1F4]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "ml" ? "സ്വാഗത പേജിലേക്ക്" : "Back to Welcome"}</span>
            </button>

            {/* Mode Switch Tabs: Sign In / Create Account */}
            <div className="flex bg-[#F3F1F4] p-1 rounded-2xl mb-4 text-xs font-extrabold shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl transition-all tactile ${
                  authMode === "login"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "ലോഗിൻ (Sign In)" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl transition-all tactile ${
                  authMode === "signup"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "അക്കൗണ്ട് ഉണ്ടാക്കുക" : "Create Account"}
              </button>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {authMode === "login"
                ? lang === "ml"
                  ? "പഠനയാത്രയിലേക്ക് സ്വാഗതം"
                  : "Welcome Back, Student!"
                : lang === "ml"
                ? "പുതിയ അക്കൗണ്ട് ഉണ്ടാക്കാം"
                : "Create Student Account"}
            </h1>
            <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
              {authMode === "login"
                ? lang === "ml"
                  ? "നിങ്ങളുടെ ഇമെയിലും പാസ്‌വേഡും നൽകി പ്രവേശിക്കുക."
                  : "Enter your email and password to resume your missions."
                : lang === "ml"
                ? "തുടങ്ങാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക."
                : "Enter your account details to register and start exploring."}
            </p>
          </div>

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-3 p-3 bg-[#FFE5E8] border border-[#FFCCD3] text-[#B93848] rounded-[20px] text-xs font-bold flex items-center gap-2 animate-pop">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================
              FLOW 1: STUDENT LOGIN (Email & Password)
             ======================================================== */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-fade-in">
              {/* Field 1: Email */}
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  {lang === "ml" ? "ഇമെയിൽ വിലാസം" : "Student Email"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#626273] pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-13 pl-11 pr-4 bg-[#F3F1F4] rounded-[18px] text-[#141426] text-xs font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  {lang === "ml" ? "പാസ്‌വേഡ്" : "Password"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#626273] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-13 pl-11 pr-4 bg-[#F3F1F4] rounded-[18px] text-[#141426] text-xs font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-13 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all mt-4"
              >
                <span>{lang === "ml" ? "യാത്ര ആരംഭിക്കുക →" : "Sign In & Begin Journey →"}</span>
              </button>
            </form>
          )}

          {/* ========================================================
              FLOW 2: STUDENT SIGN UP (Account Details)
             ======================================================== */}
          {authMode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-fade-in">
              {/* Field 1: Name */}
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  {lang === "ml" ? "വിദ്യാർത്ഥിയുടെ പേര്" : "Student Full Name"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#626273] pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Amina / Zayan"
                    className="w-full h-13 pl-11 pr-4 bg-[#F3F1F4] rounded-[18px] text-[#141426] text-xs font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 2: Email */}
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  {lang === "ml" ? "ഇമെയിൽ വിലാസം" : "Student Email"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#626273] pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-13 pl-11 pr-4 bg-[#F3F1F4] rounded-[18px] text-[#141426] text-xs font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  {lang === "ml" ? "പാസ്‌വേഡ്" : "Create Password"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#626273] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="At least 3 characters"
                    className="w-full h-13 pl-11 pr-4 bg-[#F3F1F4] rounded-[18px] text-[#141426] text-xs font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Submit & Start Button */}
              <button
                type="submit"
                className="w-full h-13 bg-gradient-to-r from-[#191A22] to-[#2E2050] hover:from-black hover:to-[#191A22] text-[#FFD184] hover:text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all mt-4"
              >
                <Sparkles className="w-4 h-4 text-[#FFD184]" />
                <span>{lang === "ml" ? "അക്കൗണ്ട് ഉണ്ടാക്കി യാത്ര ആരംഭിക്കാം 🚀" : "Create Account & Start Journey 🚀"}</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pt-2 pb-1 text-[11px] text-[#626273]/60 font-medium">
        <span>Noor Journey • Islamic Learning for Children</span>
      </footer>
    </div>
  );
};
