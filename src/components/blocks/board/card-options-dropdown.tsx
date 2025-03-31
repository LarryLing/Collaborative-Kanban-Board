"use client";

import React from "react";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Copy, Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Card as CardType, Column as ColumnType } from "@/lib/types";

type CardOptionsDropdownProps = {
	boardId: string;
	card: CardType;
	cards: CardType[];
	columns: ColumnType[];
};

export default function CardOptionsDropdown({
	boardId,
	card,
	cards,
	columns,
}: CardOptionsDropdownProps) {
	const supabase = createClient();

	async function duplicateCard() {
		const duplicatedCard = {
			...card,
			id: crypto.randomUUID(),
		} as CardType;

		const index = cards.findIndex((idxCard) => idxCard.id === card.id);
		let updatedCardsJson = [...cards];
		updatedCardsJson.splice(index, 0, duplicatedCard);

		const { error: updateCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updateCardsError) throw updateCardsError;
	}

	async function deleteCard() {
		const updatedCardsJson = cards.filter(
			(filteredCard) => filteredCard.id !== card.id,
		);

		const { error: updateCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updateCardsError) throw updateCardsError;
	}

	async function handleMoveCard(column_id: string) {
		const updatedCardsJson = cards.map((idxCard) =>
			idxCard.id === card.id
				? {
						...idxCard,
						column_id: column_id,
					}
				: idxCard,
		);

		const { error: updateCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updateCardsError) throw updateCardsError;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-2 top-2"
				>
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => duplicateCard()}>
					<Copy className="size-4" />
					<span>Duplicate</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => deleteCard()}>
					<Trash2 className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={card.column_id}
					onValueChange={(value) => handleMoveCard(value)}
				>
					{columns.map((column) => (
						<DropdownMenuRadioItem
							key={column.id}
							value={column.id}
						>
							{column.title}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
