import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { IslamicGamesScreen } from "@/components/games/IslamicGamesScreen";

export const Route = createFileRoute("/games")({
  component: GamesRoute,
});

function GamesRoute() {
  return (
    <StudentAppShell currentTab="journey">
      <IslamicGamesScreen />
    </StudentAppShell>
  );
}
