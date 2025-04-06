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
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import { UseCardsType } from "@/hooks/use-cards";

type CardOptionsDropdownProps = {
	card: CardType;
	columns: ColumnType[];
	duplicateCard: UseCardsType["duplicateCard"];
	deleteCard: UseCardsType["deleteCard"];
	moveCardToColumn: UseCardsType["moveCardToColumn"];
};

export default function CardOptionsDropdown({
	card,
	columns,
	duplicateCard,
	deleteCard,
	moveCardToColumn,
}: CardOptionsDropdownProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="absolute right-2 top-2">
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => duplicateCard(card)}>
					<Copy className="size-4" />
					<span>Duplicate</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => deleteCard(card.id)}>
					<Trash2 className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={card.column_id}
					onValueChange={(columnId) =>
						moveCardToColumn(card.id, card.column_id, columnId)
					}
				>
					{columns.map((column) => (
						<DropdownMenuRadioItem key={column.id} value={column.id}>
							{column.title}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
