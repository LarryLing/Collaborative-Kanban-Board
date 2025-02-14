import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

	console.log(date)
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
