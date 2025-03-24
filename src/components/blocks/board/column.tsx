"use client";

import { Card as CardType, Column as ColumnType } from "@/lib/types";
import React from "react";
import Card from "./card";
import DropIndicator from "./drop-indicator";
import NewCard from "./new-card";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

type ColumnProps = {
	column: ColumnType;
	cards: CardType[];
};

export default function Column({ column, cards }: ColumnProps) {
	const filteredCards = cards.filter((card) => card.column_id === column.id);

	return (
		<div className="w-72 shrink-0">
			<div className="px-1 py-2 flex items-center justify-between">
				<div className="rounded-md font-semibold">
					<span className="mr-3">{column.name}</span>
					<span className="text-sm">{filteredCards.length}</span>
				</div>
				<div className="space-x-2">
					<Button variant="ghost" size="icon">
						<Ellipsis />
					</Button>
					<NewCard
						size="icon"
						boardId={column.board_id}
						columnId={column.id}
                        position={filteredCards.length}
					/>
				</div>
			</div>
			<div>
				{filteredCards.map((filteredCard) => (
					<Card key={filteredCard.id} card={filteredCard} />
				))}
				<DropIndicator columnId={column.id} />
				<NewCard
					size="default"
					boardId={column.board_id}
					columnId={column.id}
                    position={filteredCards.length}
				/>
			</div>
		</div>
	);
}
