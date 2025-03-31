import BoardClientComponent from "@/components/blocks/board/board-client-component";
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

	const fetchedColumns = columnsData.columns as Column[];

	const { data: cardsData, error: cardsError } = await supabase
		.from("cards")
		.select("cards")
		.eq("board_id", boardId)
		.single();

	if (cardsError) throw cardsError;

	const fetchedCards = cardsData.cards as Card[];

	let boardCover = null;

	if (boardData.cover_path) {
		const { data: publicUrl } = await supabase.storage
			.from("covers")
			.getPublicUrl(boardData.cover_path);

		boardCover = publicUrl.publicUrl;
	}

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<RefreshComponent />
			<BoardHeader
				boardId={boardData.id}
				boardTitle={boardData.title}
				boardCover={boardCover}
			/>
			<Separator className="w-full" />
			<div className="flex justify-center">
				<BoardClientComponent
					boardId={boardId}
					fetchedColumns={fetchedColumns}
					fetchedCards={fetchedCards}
				/>
			</div>
		</div>
	);
}
