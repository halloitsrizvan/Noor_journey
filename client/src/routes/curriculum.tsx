import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { SubjectCurriculumScreen } from "@/components/curriculum/SubjectCurriculumScreen";

export const Route = createFileRoute("/curriculum")({
  component: CurriculumRoute,
});

function CurriculumRoute() {
  const [subjectKey, setSubjectKey] = useState<string>("tajweed");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("subject") || params.get("key");
      if (s) setSubjectKey(s);
    }
  }, []);

  return (
    <StudentAppShell currentTab="journey">
      <SubjectCurriculumScreen initialSubjectKey={subjectKey} />
    </StudentAppShell>
  );
}
