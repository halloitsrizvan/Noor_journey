import React, { useState } from "react";
import { useNoor } from "@/lib/noor/state";
import { BrandWordmark } from "@/components/common/BrandWordmark";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { setStudentSession } from "@/lib/noor/session";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Loader2,
  User,
  BookOpen,
  CheckCircle,
  Layers,
} from "lucide-react";

interface TeacherLoginPageProps {
  onEnterTeacherSpace: () => void;
  onEnterChildSpace: () => void;
  onGoToStudentLogin: () => void;
  onBackToWelcome: () => void;
}

export const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({
  onEnterTeacherSpace,
  onEnterChildSpace,
  onGoToStudentLogin,
  onBackToWelcome,
}) => {
  const { lang, login } = useNoor();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.success) {
        setErrorMessage(
          res.error ||
            (lang === "ml"
              ? "ലോഗിൻ പരാജയപ്പെട്ടു. ഇമെയിലും പാസ്‌വേഡും പരിശോധിക്കുക."
              : "Login failed. Please verify your email and password.")
        );
      } else {
        setStudentSession(email.trim());
        onEnterTeacherSpace();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col justify-between p-5 sm:p-8 max-w-md sm:max-w-xl mx-auto">
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#626273] hover:text-[#141426] mb-2 tactile"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "ml" ? "സ്വാഗത പേജിലേക്ക്" : "Back to Welcome"}</span>
            </button>

            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#191A22]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#191A22] bg-[#FFD184] px-2 py-0.5 rounded-full">
                {lang === "ml" ? "അധ്യാപക പോർട്ടൽ" : "Teacher & Staff Portal"}
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "അധ്യാപക ലോഗിൻ" : "Teacher Sign In"}
            </h1>
            <p className="text-xs text-[#626273] font-medium mt-1">
              {lang === "ml"
                ? "പാഠ്യപദ്ധതി അവലോകനം, വിദ്യാർത്ഥികളുടെ പുരോഗതി നിരീക്ഷണം, ക്ലാസ് മാനേജ്‌മെന്റ് എന്നിവയ്ക്കായി പ്രവേശിക്കുക."
                : "Manage curriculum review, class progress tracking, and student learning oversight."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            {/* Field 1: Teacher Email */}
            <div>
              <label className="text-[11px] font-bold text-[#626273] block mb-1">
                {lang === "ml" ? "അധ്യാപക ഇമെയിൽ" : "Teacher / Staff Email"}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@noor.local"
                  className="w-full h-14 pl-12 pr-4 bg-[#F3F1F4] rounded-[20px] text-[#141426] placeholder-[#626273]/80 text-sm font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="text-[11px] font-bold text-[#626273] block mb-1">
                {lang === "ml" ? "പാസ്‌വേഡ്" : "Password"}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 bg-[#F3F1F4] rounded-[20px] text-[#141426] text-sm font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-[#B93848]/10 border border-[#B93848]/30 text-[#B93848] rounded-[18px] text-xs font-bold flex items-center gap-2 animate-pop">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-md tactile transition-all mt-4 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5 text-[#FFD184]" />
                  <span>{lang === "ml" ? "പോർട്ടലിലേക്ക് പ്രവേശിക്കുക →" : "Sign In to Teacher Portal →"}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Student Login Link */}
          <div className="mt-5 pt-4 border-t border-[#E4E0E9] text-center space-y-2">
            <span className="text-[11px] text-[#626273] block font-medium">
              {lang === "ml" ? "വിദ്യാർത്ഥിയാണോ? പാഠങ്ങളിലേക്ക് പോകാം:" : "Are you a student looking for lessons?"}
            </span>
            <button
              type="button"
              onClick={onGoToStudentLogin}
              className="w-full py-2.5 px-3 rounded-2xl bg-white border border-[#E4E0E9] hover:border-[#7857E8] text-[#141426] font-extrabold text-xs tactile transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <User className="w-4 h-4 text-[#7857E8]" />
              <span>{lang === "ml" ? "വിദ്യാർത്ഥി ലോഗിനിലേക്ക് മാറുക →" : "Go to Student Login →"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pt-2 pb-1 text-[11px] text-[#626273]/60 font-medium">
        <span>Noor Journey • Teacher & Curriculum Portal</span>
      </footer>
    </div>
  );
};
