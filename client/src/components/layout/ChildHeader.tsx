import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions } from "@/content/worlds-data";
import { Volume2, VolumeX, Shield, Sparkles, BookOpen } from "lucide-react";

interface ChildHeaderProps {
  onOpenParentGate: () => void;
  onOpenProfilePicker?: () => void;
  onSwitchTab?: (tab: "journey" | "practice" | "collection") => void;
}

export const ChildHeader: React.FC<ChildHeaderProps> = ({
  onOpenParentGate,
  onOpenProfilePicker,
  onSwitchTab,
}) => {
  const {
    activeProfile,
    lang,
    setLang,
    state,
    toggleSound,
    getTotalXp,
    getCurrentLevel,
    getDueReviews,
  } = useNoor();

  const t = translations[lang];
  const totalXp = getTotalXp();
  const currentLevel = getCurrentLevel();
  const dueReviews = getDueReviews();

  const currentAvatar = avatarOptions.find((a) => a.id === activeProfile?.avatarId) ?? avatarOptions[0];

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b-2 border-border/80 px-3 py-2.5 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Child Profile & Avatar */}
        <button
          type="button"
          onClick={onOpenProfilePicker}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 border border-primary/20 tactile text-left"
          title={t.enterChildName}
          aria-label={`${activeProfile?.nickname ?? "Child"}, Level ${currentLevel}`}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
            style={{ backgroundColor: currentAvatar.color }}
          >
            {activeProfile?.nickname?.slice(0, 1) ?? "നൂ"}
          </div>
          <div className="flex flex-col leading-tight pr-1">
            <span className="text-xs font-bold text-foreground truncate max-w-[80px]">
              {activeProfile?.nickname ?? "സയാൻ"}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {t.level} {currentLevel}
            </span>
          </div>
        </button>

        {/* Stats: XP & Due Reviews */}
        <div className="flex items-center gap-1.5">
          {/* XP Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200"
            title={`${totalXp} XP`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-extrabold tracking-tight">{totalXp}</span>
            <span className="text-[10px] font-semibold opacity-80">XP</span>
          </div>

          {/* Due Reviews Pill (if any) */}
          {dueReviews.length > 0 && (
            <button
              type="button"
              onClick={() => onSwitchTab?.("practice")}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-coral-soft border border-coral text-coral-deep font-bold text-[11px] tactile animate-pop"
              title={`${dueReviews.length} ${t.revisionsDueCount}`}
            >
              <BookOpen className="w-3 h-3 text-coral" />
              <span>{dueReviews.length}</span>
            </button>
          )}
        </div>

        {/* Controls: Lang Toggle, Sound & Parent Gate */}
        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === "ml" ? "en" : "ml")}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-xs font-bold text-primary tactile"
            title={lang === "ml" ? "Switch to English" : "മലയാളത്തിലേക്ക് മാറ്റുക"}
            aria-label="Toggle language"
          >
            {lang === "ml" ? "EN" : "മല"}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground tactile"
            title={state.prefs.sound ? "Sound on" : "Sound muted"}
            aria-label="Toggle sound"
          >
            {state.prefs.sound ? (
              <Volume2 className="w-3.5 h-3.5 text-primary" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>

          {/* Adult / Parent Gate */}
          <button
            type="button"
            onClick={onOpenParentGate}
            className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 tactile"
            title={t.parentAreaTitle}
            aria-label="Open parent area"
          >
            <Shield className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
