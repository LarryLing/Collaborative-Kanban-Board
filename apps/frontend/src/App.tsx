import { RouterProvider } from "@tanstack/react-router";
import {
  AuthProvider,
  useAuth,
  type AuthProviderProps,
} from "react-oidc-context";
import { router } from "./main";

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  if (
    !import.meta.env.VITE_COGNITO_AUTHORITY ||
    !import.meta.env.VITE_COGNITO_CLIENT_ID ||
    !import.meta.env.VITE_COGNITO_REDIRECT_URI ||
    !import.meta.env.VITE_COGNITO_RESPONSE_TYPE ||
    !import.meta.env.VITE_COGNITO_SCOPE
  ) {
    throw new Error("Missing Cognito Environment Variables");
  }

  const cognitoAuthConfig: AuthProviderProps = {
    authority: import.meta.env.VITE_COGNITO_AUTHORITY,
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
    response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE,
    scope: import.meta.env.VITE_COGNITO_SCOPE,
  };

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <InnerApp />
    </AuthProvider>
  );
}
