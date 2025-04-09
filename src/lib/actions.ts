"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import {
	UserFormState,
	LoginFormSchema,
	EmailFormSchema,
	SignupFormSchema,
	ResetPasswordFormSchema,
	EditProfileFormSchema,
	DeleteAccountFormSchema,
} from "@/lib/definitions";
import { headers } from "next/headers";

export async function signup(formState: UserFormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
		displayName: formData.get("displayName"),
		email: formData.get("email"),
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { data: signupData, error: signupError } = await supabase.auth.signUp(
            {
                email: validatedFields.data.email,
                password: validatedFields.data.newPassword,
                options: {
                    data: {
                        display_name: validatedFields.data.displayName,
                    },
                },
            },
        );

        if (signupError) throw signupError;

        if (
            signupData.user &&
            signupData.user.identities &&
            signupData.user.identities.length === 0
        ) {
            const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email: validatedFields.data.email,
            });

            if (resendError) throw resendError;

            return {
                errors: {
                    email: ["This email is already associated with an account."],
                },
            };
        }

        revalidatePath("/", "layout");

        return {
            toast: {
                title: "Success!",
                message: "Please check your inbox to confirm your signup.",
            },
        };
    } catch {
        return {
			toast: {
				title: "Something went wrong...",
				message:
					"We couldn't sign you up at this time. Please try again.",
			},
		};
    }
}

export async function login(formState: UserFormState, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { error: signinError } = await supabase.auth.signInWithPassword(
            validatedFields.data,
        );

        if (signinError?.code === "invalid_credentials") {
            const { error: updateError } = await supabase.auth.verifyOtp({
                email: validatedFields.data.email,
                token: validatedFields.data.password,
                type: "email",
            });

            if (updateError) {
                return {
                    errors: {
                        email: ["Incorrect email or password."],
                    },
                };
            }

            revalidatePath("/", "layout");
            redirect("/dashboard");
        } else if (signinError?.status && signinError.status >= 500) throw signinError;

        revalidatePath("/", "layout");
        redirect("/dashboard");
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message:
                    "We couldn't log you in at this time. Please try again.",
            },
        };
    }
}

export async function loginWithGoogle() {
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	const { data: oauthData, error: oauthError } =
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${origin}/auth/callback`,
			},
		});

	if (oauthError) throw oauthError;

	if (oauthData.url) redirect(oauthData.url);
}

export async function loginWithGithub() {
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	const { data: oauthData, error: oauthError } =
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${origin}/auth/callback`,
			},
		});

	if (oauthError) throw oauthError;

	if (oauthData.url) redirect(oauthData.url);
}

export async function signout() {
	const supabase = await createClient();

	const { error: singoutError } = await supabase.auth.signOut();

	if (singoutError) throw singoutError;

	revalidatePath("/");
	redirect("/login");
}

export async function sendOtpEmail(formState: unknown, formData: FormData) {
    const validatedFields = EmailFormSchema.safeParse({
		email: formData.get("email"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: validatedFields.data.email,
            options: {
                shouldCreateUser: false,
            },
        });

        if (otpError) throw otpError;

        return {
            toast: {
                title: "Success!",
                message: "Please check your inbox to see your one-time password.",
            },
        };
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not send you a one-time password. Please try again.",
            },
        };
    }
}

export async function updatePassword(formState: UserFormState, formData: FormData) {
    const validatedFields = ResetPasswordFormSchema.safeParse({
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        const { error: passwordError } = await supabase.rpc(
            "handle_password_change",
            {
                newpassword: validatedFields.data.newPassword,
                userid: userData.user.id,
            },
        );

        if (passwordError) throw passwordError;

        revalidatePath("/");

        return {
            toast: {
                title: "Success!",
                message: "Your password has been successfully updated.",
            },
        };
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your password. Please try again.",
            },
        }
    }
}

export async function updateEmail(formState: UserFormState, formData: FormData) {
    const validatedFields = EmailFormSchema.safeParse({
		email: formData.get("email"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { data: emailExistsData, error: emailExistsError } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", validatedFields.data.email);

        if (emailExistsError) throw emailExistsError;

        if (emailExistsData.length > 0) {
            return {
                errors: {
                    email: ["This email is already associated with an account!"],
                },
            };
        }

        const { error: updateError } = await supabase.auth.updateUser({
            email: validatedFields.data.email,
            data: {
                email: validatedFields.data.email,
            },
        });

        if (updateError) throw updateError;

        revalidatePath("/");

        return {
            toast: {
                title: "Success!",
                message: "Please check your inboxes for confirmation emails.",
            },
        };
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your email. Please try again.",
            },
        }
    }
}

export async function updateUserProfile(
	formState: UserFormState,
	formData: FormData,
) {
    const validatedFields = EditProfileFormSchema.safeParse({
		displayName: formData.get("displayName"),
		aboutMe: formData.get("aboutMe"),
		social0: formData.get("social0"),
		social1: formData.get("social1"),
		social2: formData.get("social2"),
		social3: formData.get("social3"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                display_name: validatedFields.data.displayName,
                about_me: validatedFields.data.aboutMe,
            })
            .eq("id", userData.user.id);

        if (profileError) throw profileError;

        const { error: socialsDeleteError } = await supabase
            .from("socials")
            .delete()
            .eq("profile_id", userData.user.id);

        if (socialsDeleteError) socialsDeleteError;

        const { error: socialsInsertError } = await supabase
            .from("socials")
            .insert([
                {
                    profile_id: userData.user.id,
                    url: validatedFields.data.social0 || "",
                },
                {
                    profile_id: userData.user.id,
                    url: validatedFields.data.social1 || "",
                },
                {
                    profile_id: userData.user.id,
                    url: validatedFields.data.social2 || "",
                },
                {
                    profile_id: userData.user.id,
                    url: validatedFields.data.social3 || "",
                },
            ]);

        if (socialsInsertError) throw socialsInsertError;

        revalidatePath("/");

        return {
            toast: {
                title: "Success!",
                message: "Profile successfully updated.",
            },
        }
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your profile. Please try again.",
            },
        }
    }
}

export async function uploadAvatar(userId: string, file: File) {
    try {
        const supabase = await createClient();

        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

        const uploadAvatarPromise = supabase.storage
            .from("avatars")
            .upload(filePath, file);

        const updateProfilePromise = supabase
            .from("profiles")
            .update({
                avatar_path: filePath,
            })
            .eq("id", userId);

        const [uploadAvatarResponse, updateProfileResponse] = await Promise.all([uploadAvatarPromise, updateProfilePromise])

        if (uploadAvatarResponse.error) throw uploadAvatarResponse.error;
        if (updateProfileResponse.error) throw updateProfileResponse.error;

        revalidatePath("/settings");

        return {
            toast: {
                title: "Success!",
                message: "Your avatar has been successfully updated.",
            },
        }

    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your avatar. Please try again.",
            },
        }
    }
}

export async function deleteAccount(formState: UserFormState, formData: FormData) {
    const validatedFields = DeleteAccountFormSchema.safeParse({
		prompt: formData.get("prompt"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

    try {
        const supabase = await createClient();

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        const { data: folderData, error: folderError } = await supabase.storage
            .from("avatars")
            .list(`${userData.user.id}`);

        if (folderError) throw folderError;

        if (folderData.length > 0) {
            const files = folderData.map((file) => `${userData.user.id}/${file.name}`);
            const { error: removeError } = await supabase.storage
                .from("avatars")
                .remove(files);

            if (removeError) throw removeError;
        }

        const { error: deleteError } = await supabase.rpc(
            "handle_delete_user"
        );

        if (deleteError) throw deleteError;

        const { error: signoutError } = await supabase.auth.signOut();

        if (signoutError) throw signoutError;

        revalidatePath("/");
        redirect("/");
    } catch {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not delete your account. Please try again.",
            },
        }
    }
}

export async function createBoard() {
    const supabase = await createClient();

    const { data: userData, error: userError } =
        await supabase.auth.getUser();

    if (userError) throw userError;

    const newBoardId = crypto.randomUUID();

    const { error: boardError } = await supabase.from("boards").insert({
        id: newBoardId,
        profile_id: userData.user.id,
    })

    if (boardError) throw boardError;

    revalidatePath("/")
    redirect("/board/" + newBoardId);
}

export async function deleteBoard(boardId: string) {
    const supabase = await createClient();

    const { data: folderData, error: folderError } = await supabase.storage
        .from("covers")
        .list(boardId);

    if (folderError) throw folderError;

    if (folderData.length > 0) {
        const files = folderData.map((file) => `${boardId}/${file.name}`);
        const { error: removeError } = await supabase.storage
            .from("covers")
            .remove(files);

        if (removeError) throw removeError;
    }

    const { error: deleteError } = await supabase
        .from("boards")
        .delete()
        .eq("id", boardId);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard")
    redirect("/dashboard")
}
