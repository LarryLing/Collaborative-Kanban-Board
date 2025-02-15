export type UserProfile = {
	id: string
	display_name: string
	email: string
	role: string
	bio: string
	avatar: string | undefined
}

export type BoardType = {
	id: string
	owner: string
	cover?: string
	title: string
	last_opened: string
}
