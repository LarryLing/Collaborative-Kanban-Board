import BoardContent from "@/components/blocks/board/board-content";
import BoardHeader from "@/components/blocks/board/board-header";
import RefreshComponent from "@/components/blocks/board/refresh-component";
import { Separator } from "@/components/ui/separator";
import { createClient as createClientClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { Card, Column } from "@/lib/types";

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

	const updateDateOpenedPromise = supabase
		.from("boards")
		.update({
			last_opened: new Date().toISOString().toLocaleString(),
		})
		.eq("id", boardId)
		.select()
		.single();

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

	const [
		updateDateOpenedResponse,
		selectColumnsResponse,
		selectCardsResponse,
	] = await Promise.all([
		updateDateOpenedPromise,
		selectColumnsPromise,
		selectCardsPromise,
	]);

	if (updateDateOpenedResponse.error) throw updateDateOpenedResponse.error;
	if (selectColumnsResponse.error) throw selectColumnsResponse.error;
	if (selectCardsResponse.error) throw selectCardsResponse.error;

	const board = updateDateOpenedResponse.data;
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
			<BoardHeader
				boardId={board.id}
				boardTitle={board.title}
				boardCover={boardCover}
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
