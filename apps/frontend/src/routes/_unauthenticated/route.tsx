import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/boards",
      });
    }
  },
  component: UnauthenticatedLayout,
});

function UnauthenticatedLayout() {
  return <Outlet />;
}
