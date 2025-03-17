import { z } from "zod";

export const SignupFormSchema = z
	.object({
		displayName: z
			.string()
			.min(4, { message: "Name must be at least 4 characters long. " })
			.regex(/^[a-zA-Z0-9]/, {
				message: "Name must start with non-whitespace character",
			})
			.trim(),
		email: z.string().email({ message: "Please enter a valid email." }),
		newPassword: z
			.string()
			.min(6, { message: "Be at least 6 characters long." })
			.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
			.regex(/[0-9]/, { message: "Contain at least one number." })
			.regex(/[^a-zA-Z0-9]/, {
				message: "Contain at least one special character.",
			})
			.trim(),
		confirmPassword: z.string().trim(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})
	.refine((data) => /^[a-zA-Z0-9 ]*$/gi.test(data.displayName), {
		message: "Name cannot contain special characters",
		path: ["displayName"],
	});

export const LoginFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
	password: z
		.string()
		.min(6, { message: "Please enter valid a password." })
		.trim(),
});

export const EmailFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
});

export const ResetPasswordFormSchema = z
	.object({
		newPassword: z
			.string()
			.min(6, { message: "Be at least 6 characters long." })
			.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
			.regex(/[0-9]/, { message: "Contain at least one number." })
			.regex(/[^a-zA-Z0-9]/, {
				message: "Contain at least one special character.",
			})
			.trim(),
		confirmPassword: z.string().trim(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const EditProfileFormSchema = z.object({
	displayName: z
		.string()
		.min(4, { message: "Name must be at least 4 characters long." })
		.regex(/^[a-zA-Z0-9]/, {
			message: "Name must start with non-whitespace character",
		})
		.trim(),
	aboutMe: z.string().trim(),
	social0: z.string().url().optional().or(z.literal("")),
	social1: z.string().url().optional().or(z.literal("")),
	social2: z.string().url().optional().or(z.literal("")),
	social3: z.string().url().optional().or(z.literal("")),
});

export const DeleteAccountFormSchema = z
    .object({
        prompt: z.string()
    })
    .refine((data) => data.prompt === "delete my account", {
        message: "Typed prompt does not match.",
        path: ["prompt"],
    });

export const FileSchema = z.object({
    name: z.string(),
    type: z.string().startsWith("image/"),
    size: z.number().max(5 * 1024 * 1024),
});

export const UploadSchema = z.object({
    avatar: z.instanceof(File).refine((file) => FileSchema.safeParse(file).success, {
        message: "Invalid file type or size. Please upload a valid image file (max 5MB).",
    }),
});

export const RenameBoardSchema = z.object({
    title: z.string().min(1, { message: "Please enter a name for this board." }),
})

export type UserFormState =
	| {
        errors?: {
            displayName?: string[];
            email?: string[];
            avatar?: string[];
            password?: string[];
            newPassword?: string[];
            confirmPassword?: string[];
            aboutMe?: string[];
            social0?: string[];
            social1?: string[];
            social2?: string[];
            social3?: string[];
            prompt?: string[];
        };
	  }
	| undefined;

export type BoardFormState =
    | {
        errors?: {
            title?: string[];
        }
        boardId?: string,
    } | undefined;
