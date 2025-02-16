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
	bookmarked: boolean
	title: string
	last_opened: string
}

type OwnershipTypes = "Owned by anyone" | "Owned by me" | "Not owned by me"
type SortMethodTypes = "Last opened" | "Sort ascending" | "Sort descending"
