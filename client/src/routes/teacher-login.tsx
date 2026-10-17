import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TeacherLoginPage } from "@/components/auth/TeacherLoginPage";
import { setStudentSession } from "@/lib/noor/session";

export const Route = createFileRoute("/teacher-login")({
  component: TeacherLoginRoute,
});

function TeacherLoginRoute() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate({ to: "/admin" });
  }, [navigate]);

  return null;
}
