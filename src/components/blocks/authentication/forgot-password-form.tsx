"use client"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sendPasswordReset } from "@/lib/actions"
import Link from "next/link"
import React, { useActionState, useEffect } from "react"

export default function ForgotPasswordForm() {
	const { toast } = useToast()
	const [state, action, pending] = useActionState(
		sendPasswordReset,
		undefined,
	)

	useEffect(() => {
		if (state?.toast) {
			toast({
				title: state.toast.title,
				description: state.toast.title,
			})
		}
	}, [state?.toast])

	return (
		<Card className="w-[384px] ">
			<CardHeader>
				<CardTitle className="text-2xl">Recover your account</CardTitle>
				<CardDescription>
					Enter your email to receive a password reset link
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={action} className="space-y-3">
					<div className="flex flex-col gap-2">
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
					<Button type="submit" className="w-full" disabled={pending}>
						Send Reset Email
					</Button>
					<div className="text-center text-sm">
						Remember your password?{" "}
						<Link
							href="/login"
							className="underline underline-offset-4"
						>
							Return to Login
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
