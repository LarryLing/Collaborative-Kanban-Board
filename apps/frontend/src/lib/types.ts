import type z from "zod";
import {
  ConfirmSignupSchema,
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
} from "./schemas";

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
export type ConfirmSignupForm = z.infer<typeof ConfirmSignupSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export type EmailSearchBody = {
  email: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  signUp: (
    givenName: string,
    familyName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  confirmSignUp: (email: string, confirmationCode: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    password: string,
    confirmationCode: string,
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export type User = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
};
