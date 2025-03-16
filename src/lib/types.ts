export type UserProfile = {
	id: string;
	displayName: string;
	email: string;
	aboutMe: string;
	avatarUrl?: string;
	socials: string[];
};

export type BoardType = {
	boardId: string;
	ownerId: string;
	coverPath?: string;
	bookmarked: boolean;
	title: string;
	lastOpened: string;
};
