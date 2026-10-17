import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { LeaderboardScreen } from "@/components/leaderboard/LeaderboardScreen";

export const Route = createFileRoute("/collection")({
  component: CollectionRoute,
});

function CollectionRoute() {
  return (
    <StudentAppShell currentTab="collection">
      <LeaderboardScreen />
    </StudentAppShell>
  );
}
