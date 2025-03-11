export type UserProfile = {
	id: string;
	display_name: string;
	email: string;
	role: string;
	bio: string;
	avatarUrl: string | undefined;
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
