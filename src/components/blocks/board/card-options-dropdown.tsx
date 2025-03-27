"use client";

import React from "react";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Copy, Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../../../../database.types";
import { createClient } from "@/lib/supabase/client";

type CardOptionsDropdownProps = {
	index: number;
	boardId: string;
	card: Card;
	cards: Card[];
};

export default function CardOptionsDropdown({
	index,
	boardId,
	card,
	cards,
}: CardOptionsDropdownProps) {
	const supabase = createClient();

	async function duplicateCard() {
		const duplicatedCard = {
			...card,
			id: crypto.randomUUID(),
		} as Card;

		const updatedCardsJson = [...cards];
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

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-2 top-[6px]"
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
