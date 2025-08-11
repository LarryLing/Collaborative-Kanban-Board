import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

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
  const { user, logout, deleteAccount } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate({ to: "/login" });
  };

  return (
    <div>
      <h3>
        Hello: {user?.givenName} {user?.familyName}!
        <Button onClick={handleLogout}>Logout</Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete account
        </Button>
      </h3>
    </div>
  );
}
