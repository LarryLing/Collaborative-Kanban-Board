"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Column from "./column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

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

	const [columns, setColumns] = useState<ColumnType[]>(fetchedColumns);
	const [cards, setCards] = useState<CardType[]>(fetchedCards);

	useEffect(() => {
		const columnsChannel = supabase
			.channel("realtime columns")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "columns",
				},
				(payload) => {
					setColumns(payload.new.columns as ColumnType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(columnsChannel);
		};
	}, [supabase, columns, setColumns]);

	useEffect(() => {
		const cardsChannel = supabase
			.channel(`reatime cards`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "cards",
				},
				(payload) => {
					setCards(payload.new.cards as CardType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(cardsChannel);
		};
	}, [supabase, cards, setCards]);

	async function createColumn() {
		const newColumnId = crypto.randomUUID();

		const updatedColumnsJson = [
			...columns,
			{
				id: newColumnId,
				title: "New Column",
				color: "text-primary",
			},
		] as ColumnType[];

		const { error: newColumnError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (newColumnError) throw newColumnError;
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;

		const activeIndex = columns.findIndex(
			(column) => column.id === (active.id as ColumnType["id"]),
		);
		const overIndex = columns.findIndex(
			(column) => column.id === (over.id as ColumnType["id"]),
		);

		const updatedColumnsJson = arrayMove(columns, activeIndex, overIndex);

		setColumns(updatedColumnsJson);

		const { error: updateColumnsError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (updateColumnsError) throw updateColumnsError;
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 500,
				tolerance: 0,
			},
		}),
	);

	return (
		<DndContext
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			sensors={sensors}
			modifiers={[restrictToHorizontalAxis]}
		>
			<div className="flex gap-4 w-full overflow-auto pb-4">
				<SortableContext
					items={columns}
					strategy={horizontalListSortingStrategy}
				>
					{columns.map((column, index) => (
						<Column
							key={column.id}
							index={index}
							boardId={boardId}
							cards={cards}
							setCards={setCards}
							column={column}
							columns={columns}
						/>
					))}
				</SortableContext>
				<Button variant="ghost" onClick={() => createColumn()}>
					<Plus />
					<span>New Column</span>
				</Button>
			</div>
		</DndContext>
	);
}
