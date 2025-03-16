"use client";

import { createClient } from "@/lib/supabase/client";
import { BoardType } from "@/lib/types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function useBoards() {
	const [boards, setBoards] = useState<BoardType[]>([]);

	useEffect(() => {
		async function fetchBoards() {
			const supabase = await createClient();
			const { data: user } = await supabase.auth.getUser();

			if (!user.user) redirect("/login");

			const { data: boardsData, error: boardsError } = await supabase
				.from("boards")
				.select()
				.eq("owner_id", user.user.id);

			// const { data: boardsData, error: boardsError } = await supabase
			// 	.from("profile_boards_bridge")
			// 	.select(
			// 		"board_id, boards(board_id, owner_id, title, cover_path, bookmarked, last_opened)",
			// 	)
			// 	.eq("profile_id", user.user.id)
			// 	.single();

			if (boardsError) throw boardsError;

			setBoards(
				boardsData.map(
					(item) =>
						({
							boardId: item.board_id,
							ownerId: item.owner_id,
							title: item.title,
							coverPath: item.cover_path,
							bookmarked: item.bookmarked,
							lastOpened: item.last_opened,
						}) as BoardType,
				),
			);
		}

		fetchBoards();
	}, []);

	return { boards, setBoards };
}
