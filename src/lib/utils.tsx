import React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedInIcon, TwitterXIcon } from "@/components/icons/icon"
import { LinkIcon } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getLastOpened(datetime: string) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]

	const date = new Date(datetime)
	const today = new Date()

	if (date.toDateString() === today.toDateString()) {
		const shortTime = new Intl.DateTimeFormat("en-US", {
			timeStyle: "short",
		})
		return shortTime.format(date)
	}

	return (
		months[date.getMonth()] +
		" " +
		date.getDate() +
		", " +
		date.getFullYear()
	)
}

export function getSocialIcon(hostname: string) {
    const socialIconMap = {
        "www.linkedin.com": (
            <LinkedInIcon className="size-4" fill="currentColor" />
        ),
        "github.com": <GithubIcon className="size-4" fill="currentColor" />,
        "www.instagram.com": (
            <InstagramIcon className="size-4" fill="currentColor" />
        ),
        "www.facebook.com": (
            <FacebookIcon className="size-4" fill="currentColor" />
        ),
        "x.com": <TwitterXIcon className="size-4" fill="currentColor" />,
    };

    if (
        hostname !== "www.linkedin.com" &&
        hostname !== "github.com" &&
        hostname !== "www.instagram.com" &&
        hostname !== "www.facebook.com" &&
        hostname !== "x.com"
    ) {
        return <LinkIcon className="size-4" fill="currentColor" />;
    }

    return <>{socialIconMap[hostname]}</>;
}
