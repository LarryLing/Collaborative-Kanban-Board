"use client";

import { Card as CardType, Column as ColumnType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Column from "./column";

type BoardClientComponentProps = {
	fetchedCards: CardType[];
	fetchedColumns: ColumnType[];
};

export default function BoardClientComponent({
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
					event: "*",
					schema: "public",
					table: "columns",
				},
				(payload) => {
					if (payload.eventType === "DELETE") {
						setColumns(
							columns.filter(
								(column) => column.id !== payload.old.id,
							),
						);
					} else if (payload.eventType === "UPDATE") {
						let updatedColumns = [...columns];
						let index = 0;

						for (let i = 0; i < updatedColumns.length; i++) {
							if (updatedColumns[i].id === payload.old.id) {
								index = i;
								break;
							}
						}

						updatedColumns[index] = payload.new as ColumnType;

						setColumns(updatedColumns);
					} else if (payload.eventType === "INSERT") {
						setColumns([...columns, payload.new as ColumnType]);
					}
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
					event: "*",
					schema: "public",
					table: "cards",
				},
				(payload) => {
					if (payload.eventType === "DELETE") {
						setCards(
							cards.filter((card) => card.id !== payload.old.id),
						);
					} else if (payload.eventType === "UPDATE") {
						let updatedCards = [...cards];
						let index = 0;

						for (let i = 0; i < updatedCards.length; i++) {
							if (updatedCards[i].id === payload.old.id) {
								index = i;
								break;
							}
						}

						updatedCards[index] = payload.new as CardType;

						setCards(updatedCards);
					} else if (payload.eventType === "INSERT") {
						setCards([...cards, payload.new as CardType]);
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(cardsChannel);
		};
	}, [supabase, cards, setCards]);

	return (
		<div className="flex gap-4">
			{columns.map((column) => (
				<Column key={column.id} column={column} cards={cards} />
			))}
		</div>
	);
}
