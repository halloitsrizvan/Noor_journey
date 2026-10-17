import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { LeaderboardScreen } from "@/components/leaderboard/LeaderboardScreen";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardRoute,
});

function LeaderboardRoute() {
  return (
    <StudentAppShell currentTab="collection">
      <LeaderboardScreen />
    </StudentAppShell>
  );
}
