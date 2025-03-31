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
	DragOverEvent,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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

	function findColumnId(itemId: string) {
		if (columns.some((column) => column.id === itemId)) {
			return itemId as ColumnType["id"];
		}

		return cards.find((card) => card.id === itemId)?.column_id;
	}

	async function handleDragEnd(event: DragOverEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as CardType["id"];
		const overId = over.id as CardType["id"];

		const activeColumnId = findColumnId(activeId);
		const overColumnId = findColumnId(overId);

		if (!activeColumnId || !overColumnId) return;

		if (activeColumnId === overColumnId && activeId !== overId) {
			const activeIndex = cards.findIndex((card) => card.id === activeId);
			const overIndex = cards.findIndex((card) => card.id === overId);

			if (activeIndex !== -1 && overIndex !== -1) {
				const updatedCardsJson = arrayMove(
					cards,
					activeIndex,
					overIndex,
				);
				setCards(updatedCardsJson);

				const { error: updatedCardsError } = await supabase
					.from("cards")
					.update({
						cards: updatedCardsJson,
					})
					.eq("board_id", boardId);

				if (updatedCardsError) throw updatedCardsError;
			}
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

		const updatedCardsJson = cards.map((card) =>
			card.id === activeId
				? {
						...card,
						column_id: overColumnId,
					}
				: card,
		);

		setCards(updatedCardsJson);

		const { error: updatedCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updatedCardsError) throw updatedCardsError;
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
				{columns.map((column, index) => (
					<Column
						key={column.id}
						index={index}
						boardId={boardId}
						cards={cards}
						column={column}
						columns={columns}
					/>
				))}
			</DndContext>
			<Button variant="ghost" onClick={() => createColumn()}>
				<Plus />
				<span>New Column</span>
			</Button>
		</div>
	);
}
