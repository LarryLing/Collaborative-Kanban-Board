"use client";

import { GithubIcon, GoogleIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { login, loginWithGoogle, loginWithGithub } from "@/lib/actions";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";

export default function LoginPage() {
	const { toast } = useToast();
	const [state, action, pending] = useActionState(login, undefined);

	useEffect(() => {
		if (state?.toast) {
			toast({
				title: state.toast.title,
				description: state.toast.message,
			});
		}
	}, [state?.toast]);

	return (
		<div className="flex justify-center lg:justify-start h-screen">
			<div className="h-full w-[350px] lg:w-[500px] py-20 px-4 lg:px-20 border-r-0 lg:border-r-[1px] border-border flex flex-col justify-center items-start gap-4">
				<div className="w-full">
					<h2 className="font-semibold text-3xl">Welcome Back</h2>
					<p>Sign into your account</p>
				</div>
				<div className="w-full space-y-3">
					<Button
						onClick={loginWithGoogle}
						disabled={pending}
						className="w-full bg-google hover:bg-google/90 text-background text-white"
					>
						<GoogleIcon />
						Continue with Google
					</Button>
					<Button
						onClick={loginWithGithub}
						disabled={pending}
						className="w-full bg-github hover:bg-github/90 text-background text-white"
					>
						<GithubIcon />
						Continue with Github
					</Button>
				</div>
				<div className="flex justify-center items-center text-sm w-full">
					<Separator className="w-40" />
					<span className="mx-1">or</span>
					<Separator className="w-40" />
				</div>
				<form action={action} className="w-full space-y-3">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="text"
							placeholder="m@example.com"
							className="text-sm"
						/>
						{state?.errors?.email && (
							<p className="text-sm text-destructive">
								{state.errors.email}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/forgot-password"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</Link>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							className="text-sm"
						/>
						{state?.errors?.password && (
							<p className="text-sm text-destructive">
								{state.errors.password}
							</p>
						)}
					</div>
					<Button type="submit" disabled={pending} className="w-full">
						{pending ? "Logging in..." : "Login"}
					</Button>
					<div className="text-center text-sm">
						Don't have an account?{" "}
						<Link
							href="/signup"
							className="underline underline-offset-4"
						>
							Sign Up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
