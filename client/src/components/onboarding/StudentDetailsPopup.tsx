import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNoor } from "@/lib/noor/state";
import { type AgeBand, type PriorStandard } from "@/lib/noor/types";
import { Sparkles, CheckCircle2, Heart, Award } from "lucide-react";

interface StudentDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_OPTIONS: { id: PriorStandard; label: string; icon: string; ml: string }[] = [
  { id: "none", label: "Pre-Madrasa", icon: "🐣", ml: "പ്രാരംഭം" },
  { id: "1", label: "Class 1", icon: "🌱", ml: "ക്ലാസ് 1" },
  { id: "2", label: "Class 2", icon: "🌿", ml: "ക്ലാസ് 2" },
  { id: "3", label: "Class 3", icon: "⭐", ml: "ക്ലാസ് 3" },
  { id: "4", label: "Class 4", icon: "🚀", ml: "ക്ലാസ് 4" },
  { id: "5", label: "Class 5", icon: "🌙", ml: "ക്ലാസ് 5" },
  { id: "6", label: "Class 6", icon: "💎", ml: "ക്ലാസ് 6" },
  { id: "7", label: "Class 7+", icon: "👑", ml: "ക്ലാസ് 7+" },
];

const AGE_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13];

export const StudentDetailsPopup: React.FC<StudentDetailsPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, activeProfile, updateStudentDetails } = useNoor();

  const [selectedStandard, setSelectedStandard] = useState<PriorStandard>("3");
  const [selectedAge, setSelectedAge] = useState<number>(9);
  const [isSaved, setIsSaved] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (activeProfile) {
      if (activeProfile.priorStandard && activeProfile.priorStandard !== "not-sure") {
        setSelectedStandard(activeProfile.priorStandard);
      }
      if (activeProfile.ageBand === "8-9") setSelectedAge(9);
      else if (activeProfile.ageBand === "10-11") setSelectedAge(11);
      else if (activeProfile.ageBand === "12-13") setSelectedAge(13);
    }
  }, [activeProfile]);

  if (!isOpen && !isClosing) return null;

  const handleSave = () => {
    const ageBand: AgeBand =
      selectedAge <= 9 ? "8-9" : selectedAge <= 11 ? "10-11" : "12-13";

    updateStudentDetails({
      ageBand,
      priorStandard: selectedStandard,
    });

    try {
      sessionStorage.removeItem("noor_show_child_onboarding_popup");
    } catch {}

    setIsSaved(true);
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsClosing(false);
        onClose();
      }, 300);
    }, 700);
  };

  const studentName = activeProfile?.nickname || (lang === "ml" ? "കൂട്ടുകാരൻ" : "Explorer");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Sliding Dialog Container: slides up from the absolute bottom to the center of the screen */}
      <div
        className={`w-full max-w-md bg-white border-2 border-[#E4E0E9] rounded-[36px] shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden transition-all duration-500 ease-out ${
          isClosing ? "translate-y-24 opacity-0 scale-95" : ""
        }`}
        style={{
          animation: isClosing
            ? undefined
            : "popupFromBottomToCenter 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#E3D4FF]/60 to-transparent rounded-full blur-2xl pointer-events-none" />

        {isSaved ? (
          /* Celebratory Success State */
          <div className="py-12 space-y-4 animate-pop">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#EAF8E8] text-[#287553] flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2
              className="text-2xl font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "അടിപൊളി! തയ്യാറായി 🚀" : "Awesome! You're All Set! 🚀"}
            </h2>
            <p className="text-xs text-[#626273] font-bold">
              {lang === "ml"
                ? "നിങ്ങളുടെ പാഠങ്ങൾ സജ്ജമാക്കിയിരിക്കുന്നു..."
                : "Personalizing your Noor journey adventure..."}
            </p>
          </div>
        ) : (
          /* Input Form State */
          <div className="space-y-6 relative z-10">
            {/* Header Mascot & Greeting */}
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#7857E8] to-[#9B7DFF] text-white shadow-lg shadow-[#7857E8]/25 mb-3 animate-float">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2
                className="text-xl sm:text-2xl font-black text-[#141426]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lang === "ml" ? `സ്വാഗതം, ${studentName}! 🎉` : `Welcome, ${studentName}! 🎉`}
              </h2>
              <p className="text-xs text-[#626273] font-semibold mt-1">
                {lang === "ml"
                  ? "മികച്ച പാഠങ്ങൾ നൽകാൻ നിങ്ങളുടെ ക്ലാസും പ്രായവും പറയൂ!"
                  : "Tell us your class & age so we can tailor the fun missions for you!"}
              </p>
            </div>

            {/* Input 1: Class (Standard) */}
            <div className="text-left space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#141426] flex items-center gap-1.5">
                  <span>🎒</span>
                  <span>{lang === "ml" ? "ഏത് ക്ലാസിലാണ് പഠിക്കുന്നത്?" : "Which Class / Standard are you in?"}</span>
                </label>
              </div>

              {/* 4x2 Visual Button Grid */}
              <div className="grid grid-cols-4 gap-2">
                {CLASS_OPTIONS.map((item) => {
                  const isSelected = selectedStandard === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedStandard(item.id)}
                      className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all tactile text-center ${
                        isSelected
                          ? "bg-[#7857E8] text-white shadow-md shadow-[#7857E8]/30 scale-105 border-2 border-[#5C3FD1]"
                          : "bg-[#F4F2F7] text-[#141426] hover:bg-[#EBE7F2] border border-[#E4E0E9]"
                      }`}
                    >
                      <span className="text-lg leading-none">{item.icon}</span>
                      <span className="text-[11px] font-black leading-tight">
                        {lang === "ml" ? item.ml : item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Age */}
            <div className="text-left space-y-2">
              <label className="text-xs font-black text-[#141426] flex items-center gap-1.5">
                <span>🎂</span>
                <span>{lang === "ml" ? "എത്ര വയസ്സായി?" : "How old are you?"}</span>
              </label>

              {/* Horizontal Scroll / Wrap of Age Badges */}
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                {AGE_OPTIONS.map((ageVal) => {
                  const isSelected = selectedAge === ageVal;
                  return (
                    <button
                      key={ageVal}
                      type="button"
                      onClick={() => setSelectedAge(ageVal)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all tactile ${
                        isSelected
                          ? "bg-[#FFD184] text-[#141426] border-2 border-[#191A22] shadow-sm scale-110"
                          : "bg-[#F4F2F7] text-[#626273] hover:text-[#141426] hover:bg-[#EBE7F2] border border-[#E4E0E9]"
                      }`}
                    >
                      {ageVal}{ageVal === 13 ? "+" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full h-14 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg tactile transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#FFD184]" />
                <span>{lang === "ml" ? "തുടങ്ങാം! യാത്ര ആരംഭിക്കൂ 🚀" : "Let's Go! Start Adventure 🚀"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popupFromBottomToCenter {
          0% {
            transform: translateY(100vh) scale(0.9);
            opacity: 0;
          }
          70% {
            transform: translateY(-8px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
