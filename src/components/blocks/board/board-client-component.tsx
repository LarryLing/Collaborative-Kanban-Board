"use client";

import {
	Card as CardType,
	Column as ColumnType,
} from "../../../../database.types";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Column from "./column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type BoardClientComponentProps = {
	boardId: string;
	fetchedCards: CardType[];
	fetchedColumns: ColumnType[];
};

export default function BoardClientComponent({
	boardId,
	fetchedCards,
	fetchedColumns,
}: BoardClientComponentProps) {
	const supabase = createClient();

	const [cards, setCards] = useState<CardType[]>(fetchedCards);
	const [columns, setColumns] = useState<ColumnType[]>(fetchedColumns);

	useEffect(() => {
		const columnsChannel = supabase
			.channel("realtime columns")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "columns",
				},
				(payload) => {
					setColumns(payload.new.columns as ColumnType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(columnsChannel);
		};
	}, [supabase, columns, setColumns]);

	useEffect(() => {
		const cardsChannel = supabase
			.channel("realtime cards")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "cards",
				},
				(payload) => {
					setCards(payload.new.cards as CardType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(cardsChannel);
		};
	}, [supabase, cards, setCards]);

	async function createNewBoard() {
		const updatedColumnsJson = [
			...columns,
			{
				id: crypto.randomUUID(),
				title: "New Column",
			},
		] as ColumnType[];

		const { error: newColumnError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (newColumnError) throw newColumnError;
	}

	return (
		<div className="flex gap-4">
			{columns.map((column) => (
				<Column
					key={column.id}
					boardId={boardId}
					column={column}
					columns={columns}
					cards={cards}
				/>
			))}
			<div className="px-1 py-2">
				<Button variant="ghost" onClick={() => createNewBoard()}>
					<Plus />
					<span>New Column</span>
				</Button>
			</div>
		</div>
	);
}
