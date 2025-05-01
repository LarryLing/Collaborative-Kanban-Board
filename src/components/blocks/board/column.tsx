"use client";

import React from "react";
import Card from "./card";
import { MemoizedNewCard } from "./new-card";
import { Column as ColumnType } from "@/lib/types";
import { MemoizedColumnOptionsDropdown } from "./column-options-dropdown";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
			<div className="flex items-center justify-between mb-2">
				<div
					{...attributes}
					{...listeners}
					className="flex items-center rounded-md font-semibold hover:cursor-grab"
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<p className={`mr-3 ${color} max-w-[150px] truncate`}>
									{title}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{title}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<p className="text-sm">{filteredCards.length}</p>
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
						<Card
							key={card.id}
							{...card}
							columnTitle={title}
							columnColor={color}
							editCard={editCard}
						>
							<CardOptionsDropdown
								card={card}
								columns={columns}
								duplicateCard={duplicateCard}
								deleteCard={deleteCard}
								moveCardToColumn={moveCardToColumn}
							/>
						</Card>
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
