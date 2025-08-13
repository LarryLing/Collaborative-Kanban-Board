import type z from "zod";
import {
  ConfirmSignupSchema,
  CreateBoardSchema,
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
  UpdateBoardSchema,
} from "./schemas";
import type { JwtPayload } from "jwt-decode";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";

export interface IDTokenPayload extends JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
export type ConfirmSignupForm = z.infer<typeof ConfirmSignupSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type CreateBoardForm = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardForm = z.infer<typeof UpdateBoardSchema>;

export type EmailSearchBody = {
  email: string | undefined;
};

export type User = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
};

export type Board = {
  id: string;
  ownerId: string;
  title: string;
  createdAt: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  signUp: (
    givenName: User["givenName"],
    familyName: User["familyName"],
    email: User["email"],
    password: string,
  ) => Promise<void>;
  resendSignUp: (email: User["email"]) => Promise<void>;
  confirmSignUp: (
    email: User["email"],
    confirmationCode: string,
  ) => Promise<void>;
  login: (email: User["email"], password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: User["email"]) => Promise<void>;
  resetPassword: (
    email: User["email"],
    password: string,
    confirmationCode: string,
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export type UpdateBoardContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<
    {
      boardTitle: string;
    },
    unknown,
    {
      boardTitle: string;
    }
  >;
  onSubmit: (values: UpdateBoardForm) => Promise<void>;
  openUpdateBoardDialog: (
    boardId: Board["id"],
    boardTitle: Board["title"],
  ) => void;
};

export type UseBoardsReturnType = {
  boards: Board[];
  isLoading: boolean;
  createBoardMutation: UseMutateAsyncFunction<
    Board,
    Error,
    {
      boardTitle: Board["title"];
    },
    unknown
  >;
  deleteBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
    },
    unknown
  >;
  updateBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      boardTitle: Board["title"];
    },
    unknown
  >;
};
