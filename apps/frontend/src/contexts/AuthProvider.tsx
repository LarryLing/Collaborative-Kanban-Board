import type { AuthContextType, IDTokenPayload, User } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "@/lib/constants";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const buildUrl = (endpoint: string) => {
    return `${BACKEND_URL.replace(/\/$/, "")}${endpoint}`;
  };

  const loadUser = async () => {
    try {
      const accessToken: string | null = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Failed to load user: Access token not found");

        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      const response = await fetch(buildUrl("/api/auth/me"), {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { data } = await response.json();
      const { idToken, accessToken: newAccessToken } = data;

      const { sub, email, given_name, family_name } =
        jwtDecode<IDTokenPayload>(idToken);

      setUser({
        id: sub,
        email: email as string,
        givenName: given_name as string,
        familyName: family_name as string,
      } as User);
      setIsAuthenticated(true);

      localStorage.setItem("accessToken", newAccessToken as string);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to load user:", errorMessage);

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
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
        credentials: "include",
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to reset password:", errorMessage);

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to login new user:", errorMessage);

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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to sign up new user:", errorMessage);

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
      const { accessToken } = data;

      localStorage.setItem("accessToken", accessToken as string);

      await loadUser();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to login returning user:", errorMessage);

      throw error;
    }
  };

  const logout = async () => {
    try {
      const accessToken: string | null = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Failed to logout user: Access token not found");

        setUser(null);
        setIsAuthenticated(false);

        return;
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

      localStorage.removeItem("accessToken");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to logout user", errorMessage);

      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(buildUrl("/api/auth/reset-password"), {
        method: "POST",
        credentials: "include",
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to request password reset:", errorMessage);

      throw error;
    }
  };

  const deleteAccount = async () => {
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Failed to delete user: Access token not found");

      setUser(null);
      setIsAuthenticated(false);

      return;
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

      localStorage.removeItem("accessToken");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to delete user:", errorMessage);

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
    isLoading,
    signUp,
    confirmSignUp,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}
