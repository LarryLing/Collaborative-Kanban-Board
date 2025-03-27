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
import CardOptionsDropdown from "./card-options-dropdown";

type ColumnProps = {
	index: number;
	boardId: string;
	column: ColumnType;
	columns: ColumnType[];
	cards: CardType[];
};

export default function Column({
	index,
	boardId,
	column,
	columns,
	cards,
}: ColumnProps) {
	const [isRenameColumnDialogOpen, setIsRenameColumnDialogOpen] =
		useState(false);

	const filteredCards = cards.filter((card) => card.column_id === column.id);

	const { id, title, color } = column;

	return (
		<>
			<div className="w-72 shrink-0">
				<div className="px-1 py-2 flex items-center justify-between">
					<div className="rounded-md font-semibold">
						<span className={`mr-3 ${color}`}>{title}</span>
						<span className="text-sm">{filteredCards.length}</span>
					</div>
					<div className="space-x-2">
						<ColumnOptionsDropdown
							index={index}
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
					{filteredCards.map((filteredCard, index) => (
						<div
							key={filteredCard.id}
							className="w-full h-[50px] border border-border rounded-md overflow-hidden relative text-sm font-semibold"
						>
							<Card key={filteredCard.id} card={filteredCard} />
							<CardOptionsDropdown
								index={index}
								boardId={boardId}
								card={filteredCard}
								cards={cards}
							/>
						</div>
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
