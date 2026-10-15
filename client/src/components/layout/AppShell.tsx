import React from "react";
import { useNoor } from "@/lib/noor/state";
import { ChildHeader } from "./ChildHeader";
import { BottomNav, type NavTab } from "./BottomNav";

interface AppShellProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenParentGate: () => void;
  onOpenProfilePicker?: () => void;
  onSwitchStudent?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  onOpenParentGate,
  onOpenProfilePicker,
  onSwitchStudent,
  children,
}) => {
  const { lang, state } = useNoor();

  return (
    <div
      lang={lang}
      data-reduced-motion={state.prefs.reducedMotion}
      className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col items-center selection:bg-[#E3D4FF] selection:text-[#141426] relative"
    >
      {/* Responsive Content Container */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen flex flex-col relative px-4 sm:px-6">
        {/* Child Header */}
        <ChildHeader
          onOpenParentGate={onOpenParentGate}
          onOpenProfilePicker={onOpenProfilePicker}
          onSwitchStudent={onSwitchStudent}
        />

        {/* Scrollable Main Workspace with bottom navigation clearance (pb-28) */}
        <main className="flex-1 flex flex-col pt-2 pb-28">
          {children}
        </main>

        {/* Floating Dark Pill Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          onOpenProfile={onSwitchStudent || onOpenProfilePicker || onOpenParentGate}
        />
      </div>
    </div>
  );
};
