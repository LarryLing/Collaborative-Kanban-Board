import { RouterProvider } from "@tanstack/react-router";
import { router } from "./main";
import { useAuth } from "./hooks/use-auth";
import { AuthProvider } from "./contexts/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
