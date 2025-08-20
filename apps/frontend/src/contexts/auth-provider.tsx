import type { AuthContextType, IDTokenPayload, User } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { jwtDecode } from "jwt-decode";
import { invokeAPI } from "@/lib/utils";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = async () => {
    try {
      const response = await invokeAPI("/api/auth/me", "GET");
      const { data } = await response.json();
      const { idToken, accessToken: newAccessToken } = data;

      const { sub, email, given_name, family_name } = jwtDecode<IDTokenPayload>(idToken);

      setUser({
        id: sub,
        email: email as string,
        given_name: given_name as string,
        family_name: family_name as string,
      } as User);
      setIsAuthenticated(true);

      localStorage.setItem("accessToken", newAccessToken as string);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to load user:", errorMessage);

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, password: string, confirmationCode: string) => {
    try {
      await invokeAPI("/api/auth/reset-password", "PUT", JSON.stringify({ email, password, confirmationCode }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to reset password:", errorMessage);

      throw error;
    }
  };

  const confirmSignUp = async (email: string, confirmationCode: string) => {
    try {
      await invokeAPI("/api/auth/confirm-signup", "POST", JSON.stringify({ email, confirmationCode }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to login new user:", errorMessage);

      throw error;
    }
  };

  const signUp = async (given_name: string, family_name: string, email: string, password: string) => {
    try {
      await invokeAPI("/api/auth/signup", "POST", JSON.stringify({ given_name, family_name, email, password }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to sign up new user:", errorMessage);

      throw error;
    }
  };

  const resendSignUp = async (email: string) => {
    try {
      await invokeAPI("/api/auth/signup/resend", "POST", JSON.stringify({ email }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to resend sign up confirmation code:", errorMessage);

      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await invokeAPI("/api/auth/login", "POST", JSON.stringify({ email, password }));
      const { data } = await response.json();
      const { accessToken } = data;

      localStorage.setItem("accessToken", accessToken as string);

      await loadUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to login returning user:", errorMessage);

      throw error;
    }
  };

  const logout = async () => {
    try {
      await invokeAPI("/api/auth/logout", "POST");

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem("accessToken");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to logout user", errorMessage);

      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await invokeAPI("/api/auth/reset-password", "POST", JSON.stringify({ email }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to request password reset:", errorMessage);

      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await invokeAPI("/api/auth/me", "DELETE");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to delete user:", errorMessage);

      throw error;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
    };
    initialize();
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    loadUser,
    signUp,
    resendSignUp,
    confirmSignUp,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={contextValue}>{isLoading ? null : children}</AuthContext.Provider>;
}
