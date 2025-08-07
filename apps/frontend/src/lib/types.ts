import type z from "zod";
import { LoginSchema } from "./schemas";

export type LoginForm = z.infer<typeof LoginSchema>;
