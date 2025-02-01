"use client"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { login, loginWithDiscord, loginWithGithub } from "@/lib/actions"
import { Separator } from "@/components/ui/separator"
import { DiscordIcon, GithubIcon } from "@/components/icons/icon"
import Link from "next/link"

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [state, action, pending] = useActionState(login, undefined)

	return (
		<div className="h-full w-[500px] border-r-[1px] border-border flex justify-center items-center">
			Login
		</div>
	)
}
