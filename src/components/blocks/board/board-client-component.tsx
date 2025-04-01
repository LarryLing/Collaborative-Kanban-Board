"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import Column from "./column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import useColumns from "@/hooks/use-columns";
import useCards from "@/hooks/use-cards";
import {
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";

type BoardClientComponentProps = {
	boardId: string;
	fetchedColumns: ColumnType[];
	fetchedCards: CardType[];
};

export default function BoardClientComponent({
	boardId,
	fetchedColumns,
	fetchedCards,
}: BoardClientComponentProps) {
	const supabase = createClient();

	const useColumnsObject = useColumns(supabase, boardId, fetchedColumns);
	const useCardsObject = useCards(supabase, boardId, fetchedCards);

	const { columns, createColumn, moveColumn } = useColumnsObject;
	const { cards, moveCardToColumn, moveCard } = useCardsObject;

	function isColumn(itemId: string) {
		return columns.some((column) => column.id === itemId);
	}

	function findColumnId(itemId: string) {
		if (isColumn(itemId)) return itemId as ColumnType["id"];

		return cards.find((card) => card.id === itemId)?.column_id;
	}

	async function handleDragEnd(event: DragOverEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (isColumn(activeId) && isColumn(overId)) {
			const activeIndex = columns.findIndex(
				(column) => column.id === activeId,
			);
			const overIndex = columns.findIndex(
				(column) => column.id === overId,
			);

			if (activeIndex !== -1 && overIndex !== -1)
				await moveColumn(activeIndex, overIndex);
		}

		const activeColumnId = findColumnId(activeId);
		const overColumnId = findColumnId(overId);

		if (!activeColumnId || !overColumnId) return;

		if (activeColumnId === overColumnId && activeId !== overId) {
			const activeIndex = cards.findIndex((card) => card.id === activeId);
			const overIndex = cards.findIndex((card) => card.id === overId);

			if (activeIndex !== -1 && overIndex !== -1)
				await moveCard(activeIndex, overIndex);
		}
	}

	async function handleDragOver(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as CardType["id"];
		const overId = over.id as ColumnType["id"];

		const activeColumnId = findColumnId(activeId);
		const overColumnId = findColumnId(overId);

		if (!activeColumnId || !overColumnId) return;
		if (activeColumnId === overColumnId && activeId !== overId) return;
		if (activeColumnId === overColumnId) return;

		await moveCardToColumn(activeId, overColumnId);
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 500,
				tolerance: 10,
			},
		}),
	);

	return (
		<div className="flex gap-4 w-full overflow-auto pb-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
			>
				<SortableContext
					items={columns}
					strategy={horizontalListSortingStrategy}
				>
					{columns.map((column) => (
						<Column
							key={column.id}
							column={column}
							useCardsObject={useCardsObject}
							useColumnsObject={useColumnsObject}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button variant="ghost" onClick={createColumn}>
				<Plus />
				<span>New Column</span>
			</Button>
		</div>
	);
}
