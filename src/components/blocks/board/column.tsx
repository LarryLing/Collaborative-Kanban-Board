"use client";

import React, { useState } from "react";
import Card from "./card";
import NewCard from "./new-card";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import ColumnOptionsDropdown from "./column-options-dropdown";
import RenameColumnDialog from "./rename-column-dialog";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardOptionsDropdown from "./card-options-dropdown";
import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
	index: number;
	boardId: string;
	cards: CardType[];
	column: ColumnType;
	columns: ColumnType[];
};

export default function Column({
	index,
	boardId,
	cards,
	column,
	columns,
}: ColumnProps) {
	const filteredCards = cards.filter((card) => card.column_id === column.id);

	const [isRenameColumnDialogOpen, setIsRenameColumnDialogOpen] =
		useState(false);

	const { setNodeRef: droppableNodeRef } = useDroppable({ id: column.id });

	return (
		<>
			<div ref={droppableNodeRef} className="w-64 shrink-0">
				<div className="flex items-center justify-between mb-2">
					<div className="rounded-md font-semibold">
						<span
							className={`mr-3 ${column.color} w-[125px] text-ellipsis text-nowrap`}
						>
							{column.title}
						</span>
						<span className="text-sm">{filteredCards.length}</span>
					</div>
					<div className="space-x-2">
						<ColumnOptionsDropdown
							boardId={boardId}
							cards={cards}
							column={column}
							columns={columns}
							setIsRenameColumnDialogOpen={
								setIsRenameColumnDialogOpen
							}
						/>
						<NewCard
							size="icon"
							boardId={boardId}
							columnId={column.id}
							cards={cards}
						/>
					</div>
				</div>
				<SortableContext
					items={filteredCards}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-2">
						{filteredCards.map((card) => (
							<div key={card.id} className="relative">
								<Card
									boardId={boardId}
									card={card}
									cards={cards}
								/>
								<CardOptionsDropdown
									boardId={boardId}
									card={card}
									cards={cards}
								/>
							</div>
						))}
						<NewCard
							size="default"
							boardId={boardId}
							columnId={column.id}
							cards={cards}
						/>
					</div>
				</SortableContext>
			</div>
			<RenameColumnDialog
				boardId={boardId}
				column={column}
				columns={columns}
				isRenameColumnDialogOpen={isRenameColumnDialogOpen}
				setIsRenameColumnDialogOpen={setIsRenameColumnDialogOpen}
			/>
		</>
	);
}
