import BoardContent from "@/components/blocks/board/board-content";
import BoardCover from "@/components/blocks/board/board-cover";
import BoardHeader from "@/components/blocks/board/board-header";
import RefreshComponent from "@/components/blocks/board/refresh-component";
import { Separator } from "@/components/ui/separator";
import { createClient as createClientClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { Board, Card, Column, UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";

export const dynamicParams = true;

export async function generateStaticParams() {
	const supabase = createClientClient();

	const { data: boardsData, error: boardsError } = await supabase
		.from("profiles_boards_bridge")
		.select("board_id, boards(*)");

	if (boardsError) throw boardsError;

	return boardsData.map((boardData) => ({
		params: { board: String(boardData.board_id) },
	}));
}

export default async function BoardPage({
	params,
}: {
	params: Promise<{ board: string }>;
}) {
	const { board: boardId } = await params;

	const supabase = await createServerClient();

	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const { data: boardMember } = await supabase
		.from("profiles_boards_bridge")
		.select("*")
		.match({ profile_id: user.user.id, board_id: boardId })
		.single();

	if (!boardMember) redirect("/dashboard");

	const updateLastOpenedPromise = supabase
		.from("boards")
		.update({
			last_opened: new Date().toISOString().toLocaleString(),
		})
		.eq("id", boardId);

	const userPermissionsPromise = supabase
		.from("profiles_boards_bridge")
		.select("*, boards(*)")
		.match({ profile_id: user.user.id, board_id: boardId })
		.single();

	const [updateLastOpenedResponse, userPermissionsResponse] = await Promise.all([
		updateLastOpenedPromise,
		userPermissionsPromise,
	]);

	if (updateLastOpenedResponse.error) throw updateLastOpenedResponse.error;
	if (userPermissionsResponse.error) throw userPermissionsResponse.error;

	const board: Board = {
		...userPermissionsResponse.data.boards,
		bookmarked: userPermissionsResponse.data.bookmarked,
		has_invite_permissions: userPermissionsResponse.data.has_invite_permissions,
	};

	const selectCollaboratorsPromise = supabase
		.from("profiles_boards_bridge")
		.select("profile_id, profiles(*)")
		.eq("board_id", boardId);

	const selectColumnsPromise = supabase
		.from("columns")
		.select("columns")
		.eq("board_id", boardId)
		.single();

	const selectCardsPromise = supabase
		.from("cards")
		.select("cards")
		.eq("board_id", boardId)
		.single();

	const [selectCollaboratorsResponse, selectColumnsResponse, selectCardsResponse] =
		await Promise.all([
			selectCollaboratorsPromise,
			selectColumnsPromise,
			selectCardsPromise,
		]);

	if (selectCollaboratorsResponse.error) throw selectCollaboratorsResponse.error;
	if (selectColumnsResponse.error) throw selectColumnsResponse.error;
	if (selectCardsResponse.error) throw selectCardsResponse.error;

	const fetchedCollaborators = selectCollaboratorsResponse.data.map(
		(collaborator) => collaborator.profiles,
	) as UserProfile[];
	const fetchedColumns = selectColumnsResponse.data.columns as Column[];
	const fetchedCards = selectCardsResponse.data.cards as Card[];

	let boardCover = null;

	if (board.cover_path) {
		const { data: publicUrl } = supabase.storage
			.from("covers")
			.getPublicUrl(board.cover_path);

		boardCover = publicUrl.publicUrl;
	}

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<RefreshComponent />
			<BoardCover boardId={boardId} boardCover={boardCover} />
			<BoardHeader
				{...board}
				boardId={boardId}
				viewerId={user.user.id}
				fetchedCollaborators={fetchedCollaborators}
			/>
			<Separator className="w-full" />
			<BoardContent
				boardId={boardId}
				fetchedColumns={fetchedColumns}
				fetchedCards={fetchedCards}
			/>
		</div>
	);
}
