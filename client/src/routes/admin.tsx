import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminPortalScreen } from "@/components/admin/AdminPortalScreen";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  return <AdminPortalScreen />;
}
