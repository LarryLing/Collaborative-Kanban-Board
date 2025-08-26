import { RouterProvider } from "@tanstack/react-router";

import { AuthProvider } from "./contexts/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";
import { useAuth } from "./hooks/use-auth";
import { router } from "./main";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider context={{ auth }} router={router} />;
}
