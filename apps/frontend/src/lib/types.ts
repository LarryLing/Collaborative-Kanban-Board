import type z from "zod";
import { LoginSchema, SignupSchema } from "./schemas";

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
