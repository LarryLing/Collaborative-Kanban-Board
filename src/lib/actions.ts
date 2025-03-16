"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import {
	FormState,
	LoginFormSchema,
	EmailFormSchema,
	SignupFormSchema,
	ResetPasswordFormSchema,
	EditProfileFormSchema,
	DeleteAccountFormSchema,
} from "@/lib/definitions";
import { headers } from "next/headers";

export async function signup(formState: FormState, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = SignupFormSchema.safeParse({
		displayName: formData.get("displayName"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirm: formData.get("confirm"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data: signupData, error: signupError } = await supabase.auth.signUp(
		{
			email: validatedFields.data.email,
			password: validatedFields.data.password,
			options: {
				data: {
					display_name: validatedFields.data.displayName,
				},
			},
		},
	);

	if (signupError) {
		return {
			toast: {
				title: "Something went wrong...",
				message:
					"We couldn't sign you up at this time. Please try again.",
			},
		};
	}

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
}

export async function login(formState: FormState, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

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
	} else if (signinError?.status && signinError.status >= 500) {
		return {
			toast: {
				title: "Something went wrong...",
				message:
					"We couldn't log you in at this time. Please try again.",
			},
		};
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
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
	const supabase = await createClient();

	const validatedFields = EmailFormSchema.safeParse({
		email: formData.get("email"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { error: otpError } = await supabase.auth.signInWithOtp({
		email: validatedFields.data.email,
		options: {
			shouldCreateUser: false,
		},
	});

	if (otpError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not send you a one-time password. Please try again.",
            },
        };
    };

	return {
		toast: {
			title: "Success!",
			message: "Please check your inbox to see your one-time password.",
		},
	};
}

export async function updatePassword(formState: FormState, formData: FormData) {
	const supabase = await createClient();
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) throw userError;

	const userid = userData.user.id;

	const validatedFields = ResetPasswordFormSchema.safeParse({
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { error: passwordError } = await supabase.rpc(
		"handle_password_change",
		{
			newpassword: validatedFields.data.newPassword,
			userid: userid,
		},
	);

	if (passwordError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your password. Please try again.",
            },
        };
    };

	revalidatePath("/");

	return {
		toast: {
			title: "Success!",
			message: "Your password has been successfully updated.",
		},
	};
}

export async function updateEmail(formState: FormState, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = EmailFormSchema.safeParse({
		email: formData.get("email"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data: emailExistsData, error: emailExistsError } = await supabase
		.from("profiles")
		.select("email")
		.eq("email", validatedFields.data.email);

	if (emailExistsError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not determine if this email is in use. Please try again.",
            },
        };
    };

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

	if (updateError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your email. Please try again.",
            },
        };
    };

	revalidatePath("/");

	 return {
        toast: {
            title: "Success!",
            message:
					"Please check your inboxes for the confirmation emails.",
        },
    };

}

export async function updateUserProfile(
	formState: FormState,
	formData: FormData,
) {
	const supabase = await createClient();

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

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not retieve your ID. Please try again.",
            },
        };
    };

	const { error: profileError } = await supabase
		.from("profiles")
		.update({
			display_name: validatedFields.data.displayName,
			about_me: validatedFields.data.aboutMe,
		})
		.eq("id", userData.user.id);

	if (profileError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not update your profile information. Please try again.",
            },
        };
    };

	const { error: socialsDeleteError } = await supabase
		.from("socials")
		.delete()
		.eq("profile_id", userData.user.id);

	if (socialsDeleteError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not delete uour old social data. Please try again.",
            },
        };
    };

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

	if (socialsInsertError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not insert your new social data. Please try again.",
            },
        };
    };

    const { data: socialsSelectData, error: socialsSelectError } = await supabase
        .from("socials")
        .select("url")
        .eq("profile_id", userData.user.id)

    if (socialsSelectError) throw socialsSelectError;

	revalidatePath("/");

	return {
		updatedProfile: {
			displayName: validatedFields.data.displayName,
			aboutMe: validatedFields.data.aboutMe,
			socials: socialsSelectData,
		},
	};
}

export async function deleteAccount(formState: FormState, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = DeleteAccountFormSchema.safeParse({
		displayName: formData.get("displayName"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data: userData, error: userError } = await supabase
		.from("profiles")
		.select("id")
		.eq("display_name", validatedFields.data.displayName)
		.single();

	if (userError) {
		return {
			errors: {
				displayName: ["Incorrect display name."],
			},
		};
	}

	const userId = userData.id as string;

	const { data: folderData, error: folderError } = await supabase.storage
		.from("avatars")
		.list(`${userId}`);

	if (folderError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not retrieve the contents of your bucket folder. Please try again.",
            },
        };
    };

	if (folderData.length > 0) {
		const files = folderData.map((file) => `${userId}/${file.name}`);
		const { error: removeError } = await supabase.storage
			.from("avatars")
			.remove(files);

		if (removeError) {
            return {
                toast: {
                    title: "Something went wrong...",
                    message: "We could not clear your bucket folder. Please try again.",
                },
            };
        };;
	}

    const { error: socialsDeleteError } = await supabase
		.from("socials")
		.delete()
		.eq("id", userId);

	if (socialsDeleteError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not delete uour old social data. Please try again.",
            },
        };
    };

	const { error: deleteError } = await supabase.rpc("handle_delete_user");

	if (deleteError) {
        return {
            toast: {
                title: "Something went wrong...",
                message: "We could not delete your account. Please try again.",
            },
        };
    };

	const { error: signoutError } = await supabase.auth.signOut();

	if (signoutError) throw signoutError;

	revalidatePath("/");
	redirect("/");
}
