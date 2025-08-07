import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

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

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div>
      <h3>
        Hello: {auth.user?.profile.given_name} {auth.user?.profile.family_name}!
      </h3>
      <p>ID Token: {auth.user?.id_token}</p>
      <p>Access Token: {auth.user?.access_token}</p>
      <p>Refresh Token: {auth.user?.refresh_token}</p>
    </div>
  );
}
