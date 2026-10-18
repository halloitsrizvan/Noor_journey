import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Home, BookOpen, Trophy, User } from "lucide-react";
import { sfx } from "@/lib/sound/sfx";

export type NavTab = "journey" | "practice" | "collection" | "profile";

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenProfile?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenProfile,
}) => {
  const { lang, getDueReviews } = useNoor();
  const t = translations[lang];
  const dueCount = getDueReviews().length;

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: "journey",
      label: lang === "ml" ? "പഠനം" : "Journey",
      icon: Home,
    },
    {
      id: "practice",
      label: lang === "ml" ? "പരിശീലനം" : "Practice",
      icon: BookOpen,
    },
    {
      id: "collection",
      label: lang === "ml" ? "ലീഡർബോർഡ്" : "Leaderboard",
      icon: Trophy,
    },
    {
      id: "profile",
      label: lang === "ml" ? "പ്രൊഫൈൽ" : "Profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none pb-safe">
      <nav
        className="pointer-events-auto bg-[#191A22] text-white rounded-full p-1.5 shadow-xl flex items-center gap-1 max-w-sm w-full border border-white/10"
        role="navigation"
        aria-label="Primary Navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sfx.tab();
                if (tab.id === "profile" && onOpenProfile) {
                  onOpenProfile();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-2.5 rounded-full transition-all duration-200 tactile min-h-[48px] ${
                isActive
                  ? "bg-white text-[#141426] shadow-sm font-bold"
                  : "text-white/75 hover:text-white font-medium"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isActive ? "stroke-[2.5]" : "stroke-2"
                  }`}
                />
                {tab.id === "practice" && dueCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#FFD184] text-[#141426] text-[9px] font-black rounded-full flex items-center justify-center">
                    {dueCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none truncate max-w-[70px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
