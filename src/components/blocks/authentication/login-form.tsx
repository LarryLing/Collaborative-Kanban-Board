"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect } from "react"
import { login, loginWithDiscord, loginWithGithub } from "@/lib/actions"
import { Separator } from "@/components/ui/separator"
import { GoogleIcon, GithubIcon } from "@/components/icons/icon"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { toast } = useToast()
	const [state, action, pending] = useActionState(login, undefined)

	useEffect(() => {
		if (state?.toast) {
			toast({
				title: state.toast.title,
				description: state.toast.message,
			})
		}
	}, [state?.toast])

	return (
		<div className="h-full w-[500px] p-20 border-r-[1px] border-border flex flex-col justify-center items-start gap-4">
			<div className="w-full">
				<h2 className="font-semibold text-3xl">Welcome Back</h2>
				<p>Sign into your account</p>
			</div>
			<div className="w-full space-y-3">
				<Button
					onClick={loginWithDiscord} //TODO: change to loginWithDiscord
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
							href="/login/forgot-password"
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
					/>
					{state?.errors?.password && (
						<p className="text-sm text-destructive">
							{state.errors.password}
						</p>
					)}
				</div>
				<Button type="submit" disabled={pending} className="w-full">
					Login
				</Button>
				<div className="mt-3 text-center text-sm">
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
	)
}
