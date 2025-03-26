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

	const { data: boardData, error: updateOpenedError } = await supabase
		.from("boards")
		.update({
			last_opened: new Date().toISOString().toLocaleString(),
		})
		.eq("id", boardId)
		.select()
		.single();

	if (updateOpenedError) throw updateOpenedError;

	const { data: columnsData, error: columnsError } = await supabase
		.from("columns")
		.select("columns")
		.eq("board_id", boardId)
		.single();

	if (columnsError) throw columnsError;

	const fetchedColumns = columnsData.columns;

	const { data: cardsData, error: cardsError } = await supabase
		.from("cards")
		.select("cards")
		.eq("board_id", boardId)
		.single();

	if (cardsError) throw cardsError;

	const fetchedCards = cardsData.cards;

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
