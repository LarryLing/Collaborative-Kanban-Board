import type { AuthContextType, User } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const buildUrl = (endpoint: string): string =>
    `${import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "")}${endpoint}`;

  const loadUser = async () => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(buildUrl("/api/auth/me"), {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Auth check failed");
      }

      const user = (await response.json()) as User;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);

      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const resetPassword = async (
    email: string,
    password: string,
    confirmationCode: string,
  ) => {
    const response = await fetch(buildUrl("/api/auth/reset-password"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmationCode }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
    }
  };

  const confirmSignUp = async (email: string, confirmationCode: string) => {
    const response = await fetch(buildUrl("/api/auth/confirm-signup"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, confirmationCode }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
    }

    const { AccessToken, IdToken } = await response.json();

    localStorage.setItem("idToken", IdToken as string);
    localStorage.setItem("accessToken", AccessToken as string);

    await loadUser();
  };

  const signUp = async (
    givenName: string,
    familyName: string,
    email: string,
    password: string,
  ) => {
    const response = await fetch(buildUrl("/api/auth/signup"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ givenName, familyName, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(buildUrl("/api/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
    }

    const { AccessToken, IdToken } = await response.json();

    localStorage.setItem("idToken", IdToken as string);
    localStorage.setItem("accessToken", AccessToken as string);

    await loadUser();
  };

  const logout = async (): Promise<void> => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(buildUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unknown error");
      }

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    const response = await fetch(buildUrl("/api/auth/reset-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const response = await fetch(buildUrl("/api/auth/me"), {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unknown error");
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
