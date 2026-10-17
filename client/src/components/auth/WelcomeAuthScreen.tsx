import React, { useState, useEffect, useRef } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { BrandWordmark } from "@/components/common/BrandWordmark";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Illustration } from "@/components/common/Illustration";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Shield,
  Sparkles,
} from "lucide-react";

interface WelcomeAuthScreenProps {
  onEnterChildSpace: () => void;
  onGoToStudentLogin: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onEnterChildSpace,
  onGoToStudentLogin,
}) => {
  const { lang } = useNoor();
  const t = translations[lang];

  // View Mode: "hero" (Welcome landing) | "walkthrough" (3 sliding steps)
  const [viewMode, setViewMode] = useState<"hero" | "walkthrough">("hero");

  // Active slide index (0, 1, 2)
  const [slideIndex, setSlideIndex] = useState<number>(0);

  // Touch swipe gesture handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance && slideIndex < 2) {
      // Swiped left -> Next slide
      setSlideIndex((prev) => prev + 1);
    } else if (distance < -minSwipeDistance && slideIndex > 0) {
      // Swiped right -> Previous slide
      setSlideIndex((prev) => prev - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "walkthrough") return;
      if (e.key === "ArrowRight" && slideIndex < 2) {
        setSlideIndex((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && slideIndex > 0) {
        setSlideIndex((prev) => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, slideIndex]);

  const walkthroughSlides = [
    {
      id: 1,
      badge: lang === "ml" ? "ഘട്ടം 1 / 3" : "Step 1 of 3",
      title: t.walkthrough1Title,
      desc: t.walkthrough1Desc,
      role: "mission" as const,
      alt: "Colorful learning mission world",
    },
    {
      id: 2,
      badge: lang === "ml" ? "ഘട്ടം 2 / 3" : "Step 2 of 3",
      title: t.walkthrough2Title,
      desc: t.walkthrough2Desc,
      role: "practice" as const,
      alt: "Smart revision exercises and books",
    },
    {
      id: 3,
      badge: lang === "ml" ? "ഘട്ടം 3 / 3" : "Step 3 of 3",
      title: t.walkthrough3Title,
      desc: t.walkthrough3Desc,
      role: "collection" as const,
      alt: "Gold star award badge and rewards",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col justify-between p-5 sm:p-8 max-w-md sm:max-w-xl mx-auto overflow-hidden">
      {/* Top Header: Brand Wordmark + Language Switcher */}
      <header className="w-full flex items-center justify-between pb-3">
        <BrandWordmark size="md" />
        <LanguageSwitcher />
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 flex flex-col justify-center py-2">
        {/* ========================================================
            VIEW A: WELCOME HERO (Matching Left Reference Design)
           ======================================================== */}
        {viewMode === "hero" && (
          <div className="flex flex-col items-center text-center animate-pop space-y-4 my-auto">
            {/* Welcoming Heading with highlighted violet word */}
            <h1
              className="text-3xl sm:text-4xl font-black text-[#141426] leading-[1.18] tracking-tight max-w-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.heroHeadingStart}
              <span className="text-[#7857E8] font-black underline decoration-[#E3D4FF] decoration-wavy decoration-2 underline-offset-4">
                {t.heroHeadingHighlight}
              </span>
              {t.heroHeadingEnd}
            </h1>

            {/* Soft 3D Lantern-and-Book Illustration */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-1 flex items-center justify-center">
              <Illustration
                role="login"
                className="w-full h-full object-contain animate-float"
                alt="Noor the lantern floating gently above an open lavender book"
              />
            </div>

            <p className="text-sm text-[#626273] font-medium max-w-xs leading-relaxed">
              {lang === "ml"
                ? "കുട്ടികൾക്കായുള്ള രസകരവും ചിട്ടയുള്ളതുമായ ഇസ്ലാമിക പഠനയാത്രയിലേക്ക് സ്വാഗതം!"
                : "Welcome to Noor Journey! Build values, character, and knowledge through bite-sized interactive missions."}
            </p>

            {/* Actions: ONLY Get Started Button */}
            <div className="w-full max-w-xs pt-3">
              <button
                type="button"
                onClick={() => {
                  setSlideIndex(0);
                  setViewMode("walkthrough");
                }}
                className="w-full h-14 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-full font-black text-base flex items-center justify-center gap-2.5 shadow-md tactile transition-all group"
              >
                <span>{t.getStarted}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW B: 3 SLIDING STEPS (Horizontal Carousel Slide Effect)
           ======================================================== */}
        {viewMode === "walkthrough" && (
          <div className="flex-1 flex flex-col justify-between py-1 animate-fade-in">
            {/* Top Navigation Bar: Back & Skip */}
            <div className="w-full flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() => {
                  if (slideIndex > 0) {
                    setSlideIndex((prev) => prev - 1);
                  } else {
                    setViewMode("hero");
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#626273] hover:text-[#141426] transition-all px-2.5 py-1 rounded-full hover:bg-[#F3F1F4]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === "ml" ? "തിരികെ" : "Back"}</span>
              </button>

              <button
                type="button"
                onClick={onGoToStudentLogin}
                className="text-xs font-bold text-[#626273] hover:text-[#141426] px-3 py-1 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] transition-all"
              >
                {t.skip}
              </button>
            </div>

            {/* Sliding Carousel Viewport */}
            <div
              className="w-full overflow-hidden relative my-auto py-2 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Sliding Track */}
              <div
                className="flex w-full"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`,
                  transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {walkthroughSlides.map((slide) => (
                  <div
                    key={slide.id}
                    className="w-full shrink-0 flex flex-col items-center text-center px-4 select-none"
                  >
                    {/* 3D Illustration */}
                    <div className="relative w-56 h-56 sm:w-60 sm:h-60 my-2 flex items-center justify-center">
                      <Illustration
                        role={slide.role}
                        className="w-full h-full object-contain drop-shadow-sm animate-float"
                        alt={slide.alt}
                      />
                    </div>

                    {/* Step Content */}
                    <div className="max-w-sm space-y-2 mt-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#7857E8] px-3 py-0.5 rounded-full bg-[#F0E9FF] inline-block">
                        {slide.badge}
                      </span>
                      <h2
                        className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#626273] font-medium leading-relaxed max-w-xs mx-auto">
                        {slide.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls: Dot Indicators & Actions */}
            <div className="w-full max-w-xs mx-auto flex flex-col items-center space-y-3 pt-2">
              {/* Interactive Smooth Dot Indicator */}
              <div className="flex items-center justify-center gap-2">
                {walkthroughSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      slideIndex === idx
                        ? "w-8 bg-[#7857E8]"
                        : "w-2.5 bg-[#E4E0E9] hover:bg-[#C9C4D0]"
                    }`}
                  />
                ))}
              </div>

              {/* Slide Buttons */}
              {slideIndex < 2 ? (
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setSlideIndex((prev) => prev + 1)}
                    className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-md tactile transition-all"
                  >
                    <span>{t.next}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* Slide 3 (Final Step): Creative Action into Student Portal / Setup */
                <div className="w-full space-y-2 animate-pop">
                  <button
                    type="button"
                    onClick={onGoToStudentLogin}
                    className="w-full h-14 bg-gradient-to-r from-[#191A22] to-[#2E2050] hover:from-black hover:to-[#191A22] text-[#FFD184] rounded-full font-black text-base flex items-center justify-center gap-2.5 shadow-md tactile transition-all group"
                  >
                    <Sparkles className="w-5 h-5 text-[#FFD184] animate-pulse" />
                    <span>
                      {lang === "ml"
                        ? "പഠനയാത്ര ആരംഭിക്കാം ✨"
                        : "Begin Your Adventure 🚀"}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between pt-4 border-t border-[#F3F1F4] text-xs text-[#626273] font-medium">
        <span>Noor Journey</span>
        <span>ഇസ്ലാമിക പഠനയാത്ര</span>
      </footer>
    </div>
  );
};
