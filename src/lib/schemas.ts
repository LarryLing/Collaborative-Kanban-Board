import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Invalid password" }),
});

export const SignupSchema = z
  .object({
    confirmPassword: z.string().min(1, { message: "Invalid password confirmation" }),
    email: z.email().min(1, { message: "Email is required" }),
    familyName: z.string().min(1, { message: "Last name is required" }),
    givenName: z.string().min(1, { message: "First name is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ConfirmSignupSchema = z.object({
  confirmationCode: z.string().length(6, { message: "Confirmation code must be 6 digits long" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }),
});

export const ResetPasswordSchema = z
  .object({
    confirmationCode: z.string().length(6, { message: "Confirmation code must be 6 digits long" }),
    confirmPassword: z.string().min(1, { message: "Invalid password confirmation" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const CreateBoardSchema = z.object({
  boardTitle: z.string(),
});

export const UpdateBoardSchema = z.object({
  boardTitle: z.string(),
});

export const AddCollaboratorSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }),
});

export const CreateListSchema = z.object({
  listTitle: z.string(),
});

export const UpdateListSchema = z.object({
  listTitle: z.string(),
});

export const CreateCardSchema = z.object({
  cardDescription: z.string(),
  cardTitle: z.string(),
});

export const UpdateCardSchema = z.object({
  cardDescription: z.string(),
  cardTitle: z.string(),
});

export const DeleteAccountSchema = z
  .object({
    prompt: z.string(),
  })
  .refine((data) => data.prompt === "i understand", {
    message: "Prompt is incorrect",
    path: ["prompt"],
  });
