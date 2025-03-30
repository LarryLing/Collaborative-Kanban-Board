"use client";

import React, { useEffect, useState } from "react";
import Card from "./card";
import NewCard from "./new-card";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import ColumnOptionsDropdown from "./column-options-dropdown";
import RenameColumnDialog from "./rename-column-dialog";
import CardOptionsDropdown from "./card-options-dropdown";
import { createClient } from "@/lib/supabase/client";

type ColumnProps = {
	index: number;
	boardId: string;
	column: ColumnType;
	columns: ColumnType[];
};

export default function Column({
	index,
	boardId,
	column,
	columns,
}: ColumnProps) {
	const [isRenameColumnDialogOpen, setIsRenameColumnDialogOpen] =
		useState(false);
	const [cards, setCards] = useState<CardType[]>([]);

	const supabase = createClient();
	const { id, title, color } = column;

	useEffect(() => {
		async function fetchInitialData() {
			const { data: cardsData, error: cardsError } = await supabase
				.from("cards")
				.select("*")
				.eq("column_id", id)
				.single();

			if (cardsError) throw cardsError;

			setCards(cardsData.cards as CardType[]);
		}

		fetchInitialData();
	}, []);

	useEffect(() => {
		const cardsChannel = supabase
			.channel(`reatime cards`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "cards",
				},
				(payload) => {
					if (payload.new.column_id === id)
						setCards(payload.new.cards as CardType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(cardsChannel);
		};
	}, [supabase, cards, setCards]);

	return (
		<>
			<div className="w-64 shrink-0">
				<div className="flex items-center justify-between mb-2">
					<div className="rounded-md font-semibold">
						<span
							className={`mr-3 ${color} w-[125px] text-ellipsis text-nowrap`}
						>
							{title}
						</span>
						<span className="text-sm">{cards.length}</span>
					</div>
					<div className="space-x-2">
						<ColumnOptionsDropdown
							index={index}
							boardId={boardId}
							column={column}
							columns={columns}
							setIsRenameColumnDialogOpen={
								setIsRenameColumnDialogOpen
							}
						/>
						<NewCard size="icon" columnId={id} cards={cards} />
					</div>
				</div>
				<div className="space-y-1">
					{cards.map((card, index) => (
						<div key={card.id} className="relative">
							<Card
								index={index}
								columnId={id}
								card={card}
								cards={cards}
							/>
							<CardOptionsDropdown
								index={index}
								columnId={id}
								card={card}
								cards={cards}
							/>
						</div>
					))}
					<NewCard size="default" columnId={id} cards={cards} />
				</div>
			</div>
			<RenameColumnDialog
				index={index}
				boardId={boardId}
				column={column}
				columns={columns}
				isRenameColumnDialogOpen={isRenameColumnDialogOpen}
				setIsRenameColumnDialogOpen={setIsRenameColumnDialogOpen}
			/>
		</>
	);
}
