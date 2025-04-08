"use client";

import React from "react";
import { MemoizedCard } from "./card";
import { MemoizedNewCard } from "./new-card";
import { Column as ColumnType } from "@/lib/types";
import ColumnOptionsDropdown, {
	MemoizedColumnOptionsDropdown,
} from "./column-options-dropdown";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardOptionsDropdown from "./card-options-dropdown";
import { useDroppable } from "@dnd-kit/core";
import { UseCardsType } from "@/hooks/use-cards";
import { UseColumnsType } from "@/hooks/use-columns";
import { CSS } from "@dnd-kit/utilities";

type ColumnProps = ColumnType & UseCardsType & UseColumnsType;

export default function Column({
	id,
	title,
	color,
	columns,
	deleteColumn,
	changeColumnColor,
	renameColumn,
	cards,
	createCard,
	duplicateCard,
	deleteCard,
	moveCardToColumn,
	editCard,
	deleteCardsByColumnId,
}: ColumnProps) {
	const filteredCards = cards.filter((card) => card.column_id === id);

	const { setNodeRef: droppableNodeRef } = useDroppable({ id: id });

	const {
		attributes,
		listeners,
		setNodeRef: sortableNodeRef,
		transform,
		transition,
	} = useSortable({
		id: id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={sortableNodeRef} style={style} className="w-64 shrink-0">
			<div
				{...attributes}
				{...listeners}
				className="flex items-center justify-between mb-2 active:cursor-grabbing"
			>
				<div className="rounded-md font-semibold">
					<span className={`mr-3 ${color} w-[125px] text-ellipsis text-nowrap`}>
						{title}
					</span>
					<span className="text-sm">{filteredCards.length}</span>
				</div>
				<div className="space-x-2">
					<MemoizedColumnOptionsDropdown
						id={id}
						title={title}
						color={color}
						deleteColumn={deleteColumn}
						changeColumnColor={changeColumnColor}
						renameColumn={renameColumn}
						deleteCardsByColumnId={deleteCardsByColumnId}
					/>
					<MemoizedNewCard
						size="icon"
						columnId={id}
						columnTitle={title}
						columnColor={color}
						createCard={createCard}
					/>
				</div>
			</div>
			<SortableContext items={filteredCards} strategy={verticalListSortingStrategy}>
				<div ref={droppableNodeRef} className="space-y-2">
					{filteredCards.map((card) => (
						<div key={card.id} className="relative">
							<MemoizedCard
								{...card}
								columnTitle={title}
								columnColor={color}
								editCard={editCard}
							/>
							<CardOptionsDropdown
								card={card}
								columns={columns}
								duplicateCard={duplicateCard}
								deleteCard={deleteCard}
								moveCardToColumn={moveCardToColumn}
							/>
						</div>
					))}
					<MemoizedNewCard
						size="default"
						columnId={id}
						columnTitle={title}
						columnColor={color}
						createCard={createCard}
					/>
				</div>
			</SortableContext>
		</div>
	);
}
