import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { useNoor } from "@/lib/noor/state";
import { clearStudentSession } from "@/lib/noor/session";

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const navigate = useNavigate();
  const { logout } = useNoor();

  const handleSwitchStudent = async () => {
    clearStudentSession();
    try {
      await logout();
    } catch {}
    navigate({ to: "/student-login" });
  };

  return (
    <StudentAppShell currentTab="profile">
      <ProfileScreen onSwitchStudent={handleSwitchStudent} />
    </StudentAppShell>
  );
}
