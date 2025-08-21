import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/_unauthenticated")({
  component: UnauthenticatedLayout,
});

function UnauthenticatedLayout() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.location.href = "/boards";
    }
  }, [auth.isAuthenticated]);

  if (auth.isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
