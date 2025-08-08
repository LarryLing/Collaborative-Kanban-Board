import { RouterProvider } from "@tanstack/react-router";
import { router } from "./main";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./contexts/AuthProvider";

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
