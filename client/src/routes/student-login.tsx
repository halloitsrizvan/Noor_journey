import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudentLoginPage } from "@/components/auth/StudentLoginPage";
import { setStudentSession } from "@/lib/noor/session";

export const Route = createFileRoute("/student-login")({
  component: StudentLoginRoute,
});

function StudentLoginRoute() {
  const navigate = useNavigate();

  return (
    <StudentLoginPage
      onEnterChildSpace={() => {
        navigate({ to: "/journey" });
      }}
      onBackToWelcome={() => navigate({ to: "/" })}
    />
  );
}
