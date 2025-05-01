"use client";

import { GithubIcon, GoogleIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { loginWithGoogle, loginWithGithub, signup } from "@/lib/actions";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";

export default function SignupPage() {
	const { toast } = useToast();
	const [state, action, pending] = useActionState(signup, undefined);

	useEffect(() => {
		if (state?.toast) {
			toast({
				title: state.toast.title,
				description: state.toast.description,
			});
		}
	}, [state?.toast]);

	return (
		<div className="flex justify-center md:justify-start items-center h-screen">
			<div className="h-full w-full xs:w-auto px-8 border-r-0 md:border-r-[1px] border-border flex flex-col justify-center items-start gap-4">
				<div className="w-full">
					<h2 className="font-semibold text-3xl">Get Started</h2>
					<p>Create a new account</p>
				</div>
				<form action={action} className="w-full space-y-3">
					<div className="grid gap-1">
						<Label htmlFor="displayName">Display Name</Label>
						<Input
							id="displayName"
							name="displayName"
							type="text"
							placeholder="displayname"
							className="text-sm"
						/>
						{state?.errors?.displayName && (
							<p className="text-sm text-destructive">
								{state.errors.displayName}
							</p>
						)}
					</div>
					<div className="grid gap-1">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="text"
							autoComplete="on"
							placeholder="m@example.com"
							className="text-sm"
						/>
						{state?.errors?.email && (
							<p className="text-sm text-destructive">
								{state.errors.email}
							</p>
						)}
					</div>
					<div className="grid gap-1">
						<Label htmlFor="newPassword">Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type="password"
							placeholder="••••••••"
							className="text-sm"
						/>
						{state?.errors?.newPassword && (
							<div className="text-sm text-destructive">
								<p>Password must:</p>
								<ul>
									{state.errors.newPassword.map((error) => (
										<li key={error}>- {error}</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className="grid gap-1">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="••••••••"
							className="text-sm"
						/>
						{state?.errors?.confirmPassword && (
							<p className="text-sm text-destructive">
								{state.errors.confirmPassword}
							</p>
						)}
					</div>
					<Button type="submit" disabled={pending} className="w-full">
						{pending ? "Signing up..." : "Sign Up"}
					</Button>
					<div className="mt-3 text-center text-sm">
						Have an account?{" "}
						<Link href="/login" className="underline underline-offset-4">
							Login
						</Link>
					</div>
				</form>
				<div className="flex justify-center items-center text-sm w-full">
					<Separator className="w-28 xs:w-40" />
					<span className="mx-1">or</span>
					<Separator className="w-28 xs:w-40" />
				</div>
				<div className="flex flex-col xs:flex-row justify-center items-center gap-2 w-full">
					<Button
						onClick={loginWithGoogle}
						disabled={pending}
						className="bg-google hover:bg-google/70 text-background text-black [&_svg]:size-5 px-3 gap-[10px] h-10"
					>
						<GoogleIcon className="size-5" />
						<span>Sign in with Google</span>
					</Button>
					<Button
						onClick={loginWithGithub}
						disabled={pending}
						className="bg-github hover:bg-github/70 text-background text-white [&_svg]:size-5 py-[10px] px-3 gap-[10px] h-auto"
					>
						<GithubIcon />
						<span>Sign in with Github</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
