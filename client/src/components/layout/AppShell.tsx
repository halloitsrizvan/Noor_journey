import React from "react";
import { useNoor } from "@/lib/noor/state";
import { ChildHeader } from "./ChildHeader";
import { BottomNav, type NavTab } from "./BottomNav";

interface AppShellProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenParentGate: () => void;
  onOpenProfilePicker?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  onOpenParentGate,
  onOpenProfilePicker,
  children,
}) => {
  const { lang, state } = useNoor();

  return (
    <div
      lang={lang}
      data-reduced-motion={state.prefs.reducedMotion}
      className="min-h-screen bg-sand/30 flex flex-col justify-start items-center text-foreground selection:bg-primary/20 selection:text-primary relative"
    >
      {/* Centered Mobile Container */}
      <div className="w-full max-w-md min-h-screen bg-background border-x border-border/50 shadow-sm flex flex-col relative">
        {/* Child Header */}
        <ChildHeader
          onOpenParentGate={onOpenParentGate}
          onOpenProfilePicker={onOpenProfilePicker}
          onSwitchTab={onSelectTab}
        />

        {/* Scrollable Main Workspace with bottom navigation clearance */}
        <main className="flex-1 flex flex-col pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav currentTab={currentTab} onSelectTab={onSelectTab} />
      </div>
    </div>
  );
};
