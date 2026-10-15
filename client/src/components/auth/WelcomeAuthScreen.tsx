import React, { useState } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { BrandWordmark } from "@/components/common/BrandWordmark";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Illustration } from "@/components/common/Illustration";
import type { AgeBand, PriorStandard } from "@/lib/noor/types";
import {
  User,
  Calendar,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

interface WelcomeAuthScreenProps {
  onEnterChildSpace: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onEnterChildSpace,
}) => {
  const {
    lang,
    state,
    activeProfile,
    loginStudent,
    setActiveProfileId,
  } = useNoor();
  const t = translations[lang];

  // Student details state
  const [studentName, setStudentName] = useState(
    activeProfile?.nickname || (lang === "ml" ? "അമീന" : "Amina")
  );
  const [age, setAge] = useState<number>(() => {
    if (activeProfile?.ageBand === "8-9") return 9;
    if (activeProfile?.ageBand === "12-13") return 12;
    return 10;
  });
  const [standard, setStandard] = useState<PriorStandard>(
    activeProfile?.priorStandard && activeProfile.priorStandard !== "none"
      ? activeProfile.priorStandard
      : "4"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableAges = [9, 10, 11, 12, 8, 13];
  const standardOptions: { id: PriorStandard; label: { ml: string; en: string } }[] = [
    { id: "3", label: { ml: "ക്ലാസ് 3 (സ്റ്റാൻഡേർഡ് 3)", en: "Class 3 (Grade 3)" } },
    { id: "4", label: { ml: "ക്ലാസ് 4 (സ്റ്റാൻഡേർഡ് 4)", en: "Class 4 (Grade 4)" } },
    { id: "5", label: { ml: "ക്ലാസ് 5 (സ്റ്റാൻഡേർഡ് 5)", en: "Class 5 (Grade 5)" } },
    { id: "6", label: { ml: "ക്ലാസ് 6 (സ്റ്റാൻഡേർഡ് 6)", en: "Class 6 (Grade 6)" } },
    { id: "7", label: { ml: "ക്ലാസ് 7 (സ്റ്റാൻഡേർഡ് 7)", en: "Class 7 (Grade 7)" } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage(
        lang === "ml"
          ? "ദയവായി വിദ്യാർത്ഥിയുടെ പേര് നൽകുക"
          : "Please enter your name to start your journey."
      );
      return;
    }

    setErrorMessage(null);

    // Compute ageBand from selected age
    const ageBand: AgeBand =
      age <= 9 ? "8-9" : age <= 11 ? "10-11" : "12-13";

    // Create or activate student profile
    loginStudent({
      nickname: studentName.trim(),
      ageBand,
      priorStandard: standard,
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("noor_active_student_session", "true");
    }

    onEnterChildSpace();
  };

  const handleContinueAsExisting = (profileId: string) => {
    setActiveProfileId(profileId);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("noor_active_student_session", "true");
    }
    onEnterChildSpace();
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

        {/* Right Side: Student Login Form */}
        <div className="w-full max-w-sm mx-auto md:max-w-md flex flex-col justify-center">
          <div className="mb-4 text-left">
            <h2
              className="text-2xl font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.signInAsStudent}
            </h2>
            <p className="text-xs text-[#626273] font-medium mt-1">
              {lang === "ml"
                ? "ദിവസേനയുള്ള ഇസ്ലാമിക മിഷനുകൾ ആരംഭിക്കാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക."
                : "Enter your name, age, and class to begin your daily learning space."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Field 1: Student Name with User Icon */}
            <div>
              <label
                htmlFor="student-name"
                className="text-[11px] font-bold text-[#626273] uppercase tracking-wider block mb-1 pl-1"
              >
                {t.studentName}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="student-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={t.studentNamePlaceholder}
                  className="w-full h-14 pl-12 pr-4 bg-[#F3F1F4] rounded-[20px] text-[#141426] placeholder-[#626273]/80 text-sm font-bold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Field 2: Age Selector with Calendar Icon & Quick Pills */}
            <div>
              <div className="flex items-center justify-between mb-1 pl-1 pr-1">
                <label
                  htmlFor="student-age"
                  className="text-[11px] font-bold text-[#626273] uppercase tracking-wider block"
                >
                  {t.studentAge}
                </label>
                <span className="text-[11px] font-black text-[#7857E8]">
                  {age} {t.yearsOld}
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <Calendar className="w-5 h-5" />
                </div>
                <select
                  id="student-age"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-14 pl-12 pr-10 bg-[#F3F1F4] rounded-[20px] text-[#141426] text-sm font-bold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs appearance-none cursor-pointer"
                >
                  {availableAges.map((a) => (
                    <option key={a} value={a}>
                      {a} {t.yearsOld} {a >= 9 && a <= 12 ? "(Primary)" : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 text-[#626273] pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Age Buttons for Children */}
              <div className="flex items-center gap-1.5 mt-1.5 pl-1">
                {[9, 10, 11, 12].map((quickAge) => (
                  <button
                    key={quickAge}
                    type="button"
                    onClick={() => setAge(quickAge)}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                      age === quickAge
                        ? "bg-[#7857E8] text-white shadow-2xs scale-105"
                        : "bg-[#F3F1F4] text-[#626273] hover:bg-[#E4E0E9]"
                    }`}
                  >
                    {quickAge} {lang === "ml" ? "വയസ്സ്" : "yrs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Class / Standard with GraduationCap Icon */}
            <div>
              <label
                htmlFor="student-standard"
                className="text-[11px] font-bold text-[#626273] uppercase tracking-wider block mb-1 pl-1"
              >
                {t.studentClass}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#626273] pointer-events-none">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <select
                  id="student-standard"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value as PriorStandard)}
                  className="w-full h-14 pl-12 pr-10 bg-[#F3F1F4] rounded-[20px] text-[#141426] text-sm font-bold border border-transparent focus:border-[#7857E8] focus:bg-white outline-none transition-all shadow-2xs appearance-none cursor-pointer"
                >
                  {standardOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label[lang]}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 text-[#626273] pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Class Buttons */}
              <div className="flex items-center gap-1.5 mt-1.5 pl-1">
                {(["3", "4", "5", "6"] as PriorStandard[]).map((quickStd) => (
                  <button
                    key={quickStd}
                    type="button"
                    onClick={() => setStandard(quickStd)}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                      standard === quickStd
                        ? "bg-[#191A22] text-white shadow-2xs scale-105"
                        : "bg-[#F3F1F4] text-[#626273] hover:bg-[#E4E0E9]"
                    }`}
                  >
                    {t.classPrefix} {quickStd}
                  </button>
                ))}
              </div>
            </div>

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
              className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-md tactile transition-all mt-4"
            >
              <span>{t.startLearning}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Continue as Existing Student Profile (if present) */}
          {state.profiles.length > 0 && (
            <div className="mt-5 pt-3.5 border-t border-[#E4E0E9]/80 flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#626273] mb-1.5">
                {lang === "ml" ? "മുൻപ് പഠിച്ച വിദ്യാർത്ഥി:" : "Recent student profile:"}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {state.profiles.slice(0, 3).map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => handleContinueAsExisting(prof.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#141426] py-1.5 px-3 rounded-full bg-[#F0E9FF] hover:bg-[#E3D4FF] border border-[#E3D4FF] tactile transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#7857E8]" />
                    <span>
                      {t.continueAsStudent} {prof.nickname} (
                      {t.classPrefix} {prof.priorStandard}) →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
