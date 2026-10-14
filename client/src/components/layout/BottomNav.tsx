import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Compass, BookOpen, Award } from "lucide-react";

export type NavTab = "journey" | "practice" | "collection";

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { lang, getDueReviews } = useNoor();
  const t = translations[lang];
  const dueCount = getDueReviews().length;

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: "journey",
      label: t.navJourney,
      icon: Compass,
    },
    {
      id: "practice",
      label: t.navPractice,
      icon: BookOpen,
    },
    {
      id: "collection",
      label: t.navCollection,
      icon: Award,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t-2 border-border/80 shadow-lg pb-safe"
      role="navigation"
      aria-label="Child Primary Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all duration-150 tactile ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active Tab Glow Pill Indicator */}
              {isActive && (
                <span className="absolute top-0 w-12 h-1 bg-primary rounded-full animate-pop" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-115 stroke-[2.5]" : "scale-100"
                  }`}
                />
                {/* Due badge for Practice tab */}
                {tab.id === "practice" && dueCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-coral text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pop">
                    {dueCount}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight leading-none truncate max-w-[90px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
