import React, { useState } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { BrandWordmark } from "@/components/common/BrandWordmark";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Illustration } from "@/components/common/Illustration";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface WelcomeAuthScreenProps {
  onEnterChildSpace: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onEnterChildSpace,
}) => {
  const { lang, login, register, authAccount, isBackendConnected } = useNoor();
  const t = translations[lang];

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage(
        lang === "ml"
          ? "ദയവായി ഇമെയിലും പാസ്‌വേഡും നൽകുക"
          : "Please enter your email and password."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res =
        mode === "login"
          ? await login(email.trim(), password)
          : await register(email.trim(), password);

      if (!res.success) {
        setErrorMessage(
          res.error || (lang === "ml" ? "ലോഗിൻ പരാജയപ്പെട്ടു" : "Authentication failed.")
        );
      } else {
        // Successful login, proceed to child learning space
        onEnterChildSpace();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col justify-between p-5 sm:p-8 max-w-md sm:max-w-4xl mx-auto">
      {/* Top Bar: Wordmark + Language Switcher */}
      <div className="w-full flex items-center justify-between pb-4">
        <BrandWordmark size="md" />
        <LanguageSwitcher />
      </div>

      {/* Main Container: Mobile 1 column, Desktop 2 columns */}
      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center my-auto py-2">
        {/* Left Side: Welcoming Heading + 3D Lantern-and-Book Illustration */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Welcoming Heading with highlighted violet word */}
          <h1
            className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#141426] leading-[1.15] tracking-tight max-w-sm mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.heroHeadingStart}
            <span className="text-[#7857E8] font-black underline decoration-[#E3D4FF] decoration-wavy decoration-2 underline-offset-4">
              {t.heroHeadingHighlight}
            </span>
            {t.heroHeadingEnd}
          </h1>

          {/* Soft 3D Lantern-and-Book Illustration */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center">
            <Illustration
              role="login"
              className="w-full h-full object-contain animate-float"
              alt="Noor the lantern floating gently above an open lavender book"
            />
          </div>
        </div>

        {/* Right Side: Parent Sign-In Form */}
        <div className="w-full max-w-sm mx-auto md:max-w-md flex flex-col justify-center">
          <h2
            className="text-xl sm:text-2xl font-black text-[#141426] mb-5 text-left"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mode === "login"
              ? t.signInAsParent
              : lang === "ml"
              ? "രക്ഷിതാവിന്റെ അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യാം"
              : "Register as a parent"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Icon */}
            <div>
              <label
                htmlFor="parent-email"
                className="sr-only"
              >
                {t.emailAddress}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="parent-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailAddress}
                  className="w-full h-14 pl-12 pr-4 bg-[#F3F1F4] rounded-[20px] text-[#141426] placeholder-[#626273]/80 text-sm font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field with Padlock and Eye Visibility Toggle */}
            <div>
              <label
                htmlFor="parent-password"
                className="sr-only"
              >
                {t.password}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="parent-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.password}
                  className="w-full h-14 pl-12 pr-12 bg-[#F3F1F4] rounded-[20px] text-[#141426] placeholder-[#626273]/80 text-sm font-semibold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#626273] hover:text-[#141426] p-1 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Right-Aligned Link */}
            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      lang === "ml"
                        ? "രക്ഷിതാവിന്റെ ഇമെയിലിലേക്ക് പാസ്‌വേഡ് റീസെറ്റ് ലിങ്ക് അയക്കും."
                        : "Password reset link will be sent to the guardian email."
                    )
                  }
                  className="text-xs font-bold text-[#7857E8] hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-[#B93848]/10 border border-[#B93848]/30 text-[#B93848] rounded-[18px] text-xs font-bold flex items-center gap-2 animate-pop">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Large Dark Action Button with Arrow */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-md tactile transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login" ? t.logIn : t.createAccount}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode: Create Account / Log In */}
          <div className="text-center mt-5 text-xs text-[#626273]">
            <span>
              {mode === "login"
                ? `${t.newHere} `
                : lang === "ml"
                ? "അക്കൗണ്ട് ഉണ്ടോ? "
                : "Already registered? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrorMessage(null);
              }}
              className="text-[#7857E8] font-black hover:underline"
            >
              {mode === "login" ? t.createAccount : t.logIn}
            </button>
          </div>

          {/* Quick Child Space Access (no blockage for demo / child play) */}
          <div className="mt-6 pt-4 border-t border-[#E4E0E9]/70 text-center">
            <button
              type="button"
              onClick={onEnterChildSpace}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#626273] hover:text-[#141426] py-1.5 px-3 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] tactile transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7857E8]" />
              <span>
                {lang === "ml"
                  ? "നേരിട്ട് കുട്ടികളുടെ പഠന ഇടത്തിലേക്ക് →"
                  : "Go to child learning space →"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
