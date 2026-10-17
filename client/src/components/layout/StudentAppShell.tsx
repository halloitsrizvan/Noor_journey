import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { ChildHeader } from "./ChildHeader";
import { BottomNav, type NavTab } from "./BottomNav";
import { WorldSelectorModal } from "@/components/journey/WorldSelectorDialog";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { StudentDetailsPopup } from "@/components/onboarding/StudentDetailsPopup";

import { isStudentSessionActive, clearStudentSession } from "@/lib/noor/session";

interface StudentAppShellProps {
  currentTab: NavTab;
  children: React.ReactNode;
}

export const StudentAppShell: React.FC<StudentAppShellProps> = ({
  currentTab,
  children,
}) => {
  const navigate = useNavigate();
  const { lang, state, authAccount, logout } = useNoor();

  // Authentication check with cookies & Web Storage
  const [isSessionActive, setIsSessionActive] = useState<boolean>(() => {
    return isStudentSessionActive();
  });

  const isAuthenticated = isSessionActive || Boolean(authAccount);

  // Modals state
  const [isWorldSelectorOpen, setIsWorldSelectorOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState("akhlaq");

  // Check if child newly registered and needs Class & Age popup on dashboard
  useEffect(() => {
    try {
      const showPopup = sessionStorage.getItem("noor_show_child_onboarding_popup");
      if (showPopup === "true") {
        const timer = setTimeout(() => {
          setIsStudentDetailsOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Strict route guard: redirect to home/login if unauthenticated
  useEffect(() => {
    const isAuth = isStudentSessionActive() || Boolean(authAccount);
    if (!isAuth) {
      navigate({ to: "/" });
    }
  }, [authAccount, navigate]);

  const handleLogoutOrSwitch = async () => {
    clearStudentSession();
    setIsSessionActive(false);
    try {
      await logout();
    } catch {}
    navigate({ to: "/" });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === currentTab) return;
    navigate({ to: `/${tab}` as any });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      lang={lang}
      data-reduced-motion={state.prefs.reducedMotion}
      className="min-h-screen bg-[#FFFCF8] text-[#141426] flex flex-col items-center selection:bg-[#E3D4FF] selection:text-[#141426] relative"
    >
      {/* Fixed Sticky Header Bar spanning full width */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFCF8]/95 backdrop-blur-md border-b border-[#E4E0E9]/70 shadow-2xs flex justify-center transition-all">
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl px-4 sm:px-6">
          <ChildHeader
            onOpenProfilePicker={() => navigate({ to: "/profile" })}
            onSwitchStudent={handleLogoutOrSwitch}
          />
        </div>
      </header>

      {/* Responsive Content Container */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen flex flex-col relative px-4 sm:px-6">
        {/* Scrollable Main Workspace with bottom navigation clearance */}
        <main className="flex-1 flex flex-col pt-3 pb-28">{children}</main>

        {/* Floating Dark Pill Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleTabChange}
          onOpenProfile={() => handleTabChange("profile")}
        />
      </div>

      {/* World Selector Modal */}
      <WorldSelectorModal
        isOpen={isWorldSelectorOpen}
        onClose={() => setIsWorldSelectorOpen(false)}
        selectedWorldId={selectedWorldId}
        onSelectWorld={setSelectedWorldId}
      />



      {/* Onboarding & Profile Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Child Class & Age Onboarding Popup (slides from bottom of screen to center) */}
      <StudentDetailsPopup
        isOpen={isStudentDetailsOpen}
        onClose={() => setIsStudentDetailsOpen(false)}
      />
    </div>
  );
};
