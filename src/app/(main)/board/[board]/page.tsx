import BoardClientComponent from "@/components/blocks/board/board-client-component";
import RefreshComponent from "@/components/blocks/board/refresh-component";
import { createClient as createClientClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

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

export default async function Page({
	params,
}: {
	params: Promise<{ board: string }>;
}) {
	const { board: boardId } = await params;

	const supabase = await createServerClient();

	const { error: updateOpenedError } = await supabase
		.from("boards")
		.update({
			last_opened: new Date().toISOString().toLocaleString(),
		})
		.eq("board_id", boardId);

	if (updateOpenedError) throw updateOpenedError;

	const { data: boardData, error: boardError } = await supabase
		.from("boards")
		.select("*")
		.eq("board_id", boardId)
		.single();

	if (boardError) throw boardError;

	const { data: columnsData, error: columnsError } = await supabase
		.from("columns_json")
		.select("columns")
		.eq("board_id", boardId)
		.single();

	if (columnsError) throw columnsError;

	const fetchedColumns = columnsData.columns.columns;

	const { data: cardsData, error: cardsError } = await supabase
		.from("cards_json")
		.select("cards")
		.eq("board_id", boardId)
		.single();

	if (cardsError) throw cardsError;

	const fetchedCards = cardsData.cards.cards;

	return (
		<>
			<RefreshComponent />
			<BoardClientComponent
				boardId={boardId}
				fetchedColumns={fetchedColumns}
				fetchedCards={fetchedCards}
			/>
		</>
	);
}
