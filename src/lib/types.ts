export type UserProfile = {
	id: string;
	displayName: string;
	email: string;
	aboutMe: string;
	avatarUrl?: string;
	socials: URL[];
};

export type BoardType = {
	board_id: string;
	owner_id: string;
	cover?: string;
	collaborative: boolean;
	bookmarked: boolean;
	title: string;
	last_opened: string;
};
