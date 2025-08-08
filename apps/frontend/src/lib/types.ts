import type z from "zod";
import { ForgotPasswordSchema, LoginSchema, SignupSchema } from "./schemas";

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
