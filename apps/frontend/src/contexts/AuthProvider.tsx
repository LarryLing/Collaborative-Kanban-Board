import type { AuthContextType, User } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { verifier } from "@/services/jwt-verifier";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const buildUrl = (endpoint: string): string =>
    `${import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "")}${endpoint}`;

  const loadUser = async () => {
    try {
      const idToken: string | null = localStorage.getItem("idToken");
      const accessToken: string | null = localStorage.getItem("accessToken");

      if (!idToken) {
        throw new Error("ID token not found");
      }

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const payload = await verifier.verify(idToken, {
        tokenUse: "id",
        clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      });

      await verifier.verify(accessToken, {
        tokenUse: "access",
        clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      });

      setUser({
        id: payload.sub,
        email: payload.email as string,
        givenName: payload.given_name as string,
        familyName: payload.family_name as string,
      } as User);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to load user:", error);

      await refreshTokens();
    }
  };

  const refreshTokens = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Unknown");
      }

      const { data } = await response.json();
      const { idToken, accessToken } = data;

      const payload = await verifier.verify(idToken, {
        tokenUse: "id",
        clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      });

      setUser({
        id: payload.sub,
        email: payload.email as string,
        givenName: payload.given_name as string,
        familyName: payload.family_name as string,
      } as User);
      setIsAuthenticated(true);

      localStorage.setItem("idToken", idToken as string);
      localStorage.setItem("accessToken", accessToken as string);
    } catch (error) {
      console.error("Failed to regenerate tokens:", error);

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");

      throw error;
    }
  };

  const resetPassword = async (
    email: string,
    password: string,
    confirmationCode: string,
  ) => {
    try {
      const response = await fetch(buildUrl("/api/auth/reset-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmationCode }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Failed to reset password:", error);

      throw error;
    }
  };

  const confirmSignUp = async (email: string, confirmationCode: string) => {
    try {
      const response = await fetch(buildUrl("/api/auth/confirm-signup"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, confirmationCode }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { data } = await response.json();
      const { idToken, accessToken } = data;

      const payload = await verifier.verify(idToken as string, {
        tokenUse: "id",
        clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      });

      setUser({
        id: payload.sub,
        email: payload.email as string,
        givenName: payload.given_name as string,
        familyName: payload.family_name as string,
      } as User);
      setIsAuthenticated(true);

      localStorage.setItem("idToken", idToken as string);
      localStorage.setItem("accessToken", accessToken as string);
    } catch (error) {
      console.error("Failed to login new user:", error);

      throw error;
    }
  };

  const signUp = async (
    givenName: string,
    familyName: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await fetch(buildUrl("/api/auth/signup"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ givenName, familyName, email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Failed to sign up new user:", error);

      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(buildUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { data } = await response.json();
      const { idToken, accessToken } = data;

      const payload = await verifier.verify(idToken as string, {
        tokenUse: "id",
        clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      });

      setUser({
        id: payload.sub,
        email: payload.email as string,
        givenName: payload.given_name as string,
        familyName: payload.family_name as string,
      } as User);
      setIsAuthenticated(true);

      localStorage.setItem("idToken", idToken as string);
      localStorage.setItem("accessToken", accessToken as string);
    } catch (error) {
      console.error("Failed to login returning user:", error);

      throw error;
    }
  };

  const logout = async () => {
    try {
      let accessToken: string | null = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Logout error: Access token not found");

        await refreshTokens();

        accessToken = localStorage.getItem("accessToken") as string;
      }

      const response = await fetch(buildUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Failed to logout user", error);

      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(buildUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Failed to request password reset:", error);

      throw error;
    }
  };

  const deleteAccount = async () => {
    let accessToken: string | null = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Logout error: Access token not found");

      await refreshTokens();

      accessToken = localStorage.getItem("accessToken") as string;
    }

    try {
      const deleteResponse = await fetch(buildUrl("/api/auth/me"), {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!deleteResponse.ok) {
        const { error } = await deleteResponse.json();
        throw new Error(error);
      }

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Failed to delete user:", error);

      throw error;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    signUp,
    confirmSignUp,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
