"use client";

import React, { useState } from "react";
import Card from "./card";
import DropIndicator from "./drop-indicator";
import NewCard from "./new-card";
import {
	Card as CardType,
	Column as ColumnType,
} from "../../../../database.types";
import ColumnOptionsDropdown from "./column-options-dropdown";
import RenameColumnDialog from "./rename-column-dialog";

type ColumnProps = {
	boardId: string;
	column: ColumnType;
	columns: ColumnType[];
	cards: CardType[];
};

export default function Column({
	boardId,
	column,
	columns,
	cards,
}: ColumnProps) {
	const [isRenameColumnDialogOpen, setIsRenameColumnDialogOpen] =
		useState(false);

	const filteredCards = cards.filter((card) => card.column_id === column.id);

	const { id, title } = column;

	return (
		<>
			<div className="w-72 shrink-0">
				<div className="px-1 py-2 flex items-center justify-between">
					<div className="rounded-md font-semibold">
						<span className="mr-3">{column.title}</span>
						<span className="text-sm">{filteredCards.length}</span>
					</div>
					<div className="space-x-2">
						<ColumnOptionsDropdown
							boardId={boardId}
							column={column}
							columns={columns}
							cards={cards}
							setIsRenameColumnDialogOpen={
								setIsRenameColumnDialogOpen
							}
						/>
						<NewCard
							size="icon"
							boardId={boardId}
							columnId={id}
							cards={cards}
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
						boardId={boardId}
						columnId={id}
						cards={cards}
					/>
				</div>
			</div>
			<RenameColumnDialog
				boardId={boardId}
				columnId={id}
				columnTitle={title}
				columns={columns}
				isRenameColumnDialogOpen={isRenameColumnDialogOpen}
				setIsRenameColumnDialogOpen={setIsRenameColumnDialogOpen}
			/>
		</>
	);
}
