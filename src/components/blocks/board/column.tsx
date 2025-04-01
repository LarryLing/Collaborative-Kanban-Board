"use client";

import React, { useState } from "react";
import Card from "./card";
import NewCard from "./new-card";
import { Column as ColumnType } from "@/lib/types";
import ColumnOptionsDropdown from "./column-options-dropdown";
import RenameColumnDialog from "./rename-column-dialog";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardOptionsDropdown from "./card-options-dropdown";
import { useDroppable } from "@dnd-kit/core";
import { UseCardsType } from "@/hooks/use-cards";
import { UseColumnsType } from "@/hooks/use-columns";

type ColumnProps = {
	column: ColumnType;
	useCardsObject: UseCardsType;
	useColumnsObject: UseColumnsType;
};

export default function Column({
	column,
	useCardsObject,
	useColumnsObject,
}: ColumnProps) {
	const { columns, renameColumn } = useColumnsObject;
	const {
		cards,
		createCard,
		editCard,
		duplicateCard,
		deleteCard,
		moveCardToColumn,
	} = useCardsObject;

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
							column={column}
							setIsRenameColumnDialogOpen={
								setIsRenameColumnDialogOpen
							}
							useCardsObject={useCardsObject}
							useColumnsObject={useColumnsObject}
						/>
						<NewCard
							size="icon"
							columnId={column.id}
							createCard={createCard}
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
								<Card card={card} editCard={editCard} />
								<CardOptionsDropdown
									card={card}
									columns={columns}
									duplicateCard={duplicateCard}
									deleteCard={deleteCard}
									moveCardToColumn={moveCardToColumn}
								/>
							</div>
						))}
						<NewCard
							size="default"
							columnId={column.id}
							createCard={createCard}
						/>
					</div>
				</SortableContext>
			</div>
			<RenameColumnDialog
				column={column}
				renameColumn={renameColumn}
				isRenameColumnDialogOpen={isRenameColumnDialogOpen}
				setIsRenameColumnDialogOpen={setIsRenameColumnDialogOpen}
			/>
		</>
	);
}
