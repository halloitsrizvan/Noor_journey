import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { SubjectCurriculumScreen } from "@/components/curriculum/SubjectCurriculumScreen";

export const Route = createFileRoute("/subject/$key")({
  component: SubjectRoute,
});

function SubjectRoute() {
  const { key } = Route.useParams();

  return (
    <StudentAppShell currentTab="journey">
      <SubjectCurriculumScreen initialSubjectKey={key} />
    </StudentAppShell>
  );
}
