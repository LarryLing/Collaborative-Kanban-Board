import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/boards",
      });
    } else {
      throw redirect({
        to: "/login",
      });
    }
  },
});
