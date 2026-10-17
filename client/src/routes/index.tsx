import React, { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { isStudentSessionActive, setStudentSession } from "@/lib/noor/session";
import { WelcomeAuthScreen } from "@/components/auth/WelcomeAuthScreen";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const { authAccount } = useNoor();

  const isAuthenticated = isStudentSessionActive() || Boolean(authAccount);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get("portal");
      if (portal === "admin") {
        navigate({ to: "/admin" });
        return;
      }
      if (portal === "student") {
        navigate({ to: "/student-login" });
        return;
      }
    }

    if (isAuthenticated) {
      navigate({ to: "/journey" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <WelcomeAuthScreen
      onEnterChildSpace={() => {
        setStudentSession("Amina");
        navigate({ to: "/journey" });
      }}
      onGoToStudentLogin={() => navigate({ to: "/student-login" })}
    />
  );
}
