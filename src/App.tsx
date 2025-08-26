import { RouterProvider } from "@tanstack/react-router";
import { Amplify } from "aws-amplify";

import { AuthProvider } from "./contexts/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";
import { useAuth } from "./hooks/use-auth";
import { router } from "./main";
import { EVENTS_API_KEY, EVENTS_DEFAULT_AUTH_MODE, EVENTS_ENDPOINT, EVENTS_REGION } from "@/lib/constants";

export default function App() {
  Amplify.configure({
    API: {
      Events: {
        apiKey: EVENTS_API_KEY,
        defaultAuthMode: EVENTS_DEFAULT_AUTH_MODE,
        endpoint: EVENTS_ENDPOINT,
        region: EVENTS_REGION,
      },
    },
  });

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
