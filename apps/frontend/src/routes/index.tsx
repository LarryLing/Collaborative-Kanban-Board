import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Home,
});

function Home() {
  const auth = useAuth();

  return (
    <div>
      <h3>
        Hello: {auth.user?.givenName} {auth.user?.familyName}!
      </h3>
    </div>
  );
}
