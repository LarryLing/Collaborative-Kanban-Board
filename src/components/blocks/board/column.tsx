"use client";

import React, { useEffect, useState } from "react";
import Card from "./card";
import NewCard from "./new-card";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import ColumnOptionsDropdown from "./column-options-dropdown";
import RenameColumnDialog from "./rename-column-dialog";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardOptionsDropdown from "./card-options-dropdown";
import { CSS } from "@dnd-kit/utilities";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";

type ColumnProps = {
	index: number;
	boardId: string;
	cards: CardType[];
	setCards: (arg0: CardType[]) => void;
	column: ColumnType;
	columns: ColumnType[];
};

export default function Column({
	index,
	boardId,
	cards,
	setCards,
	column,
	columns,
}: ColumnProps) {
	const supabase = createClient();

	const [isRenameColumnDialogOpen, setIsRenameColumnDialogOpen] =
		useState(false);

	const filteredCards = cards.filter((card) => card.column_id === column.id);

	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({ id: column.id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 500,
				tolerance: 0,
			},
		}),
	);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;

		const activeIndex = cards.findIndex(
			(card) => card.id === (active.id as CardType["id"]),
		);
		const overIndex = cards.findIndex(
			(card) => card.id === (over.id as CardType["id"]),
		);

		let updatedCard = {
			...(active.data.current?.card as CardType),
			column_id: over.id as ColumnType["id"],
		} as CardType;

		let updatedCardsJson = arrayMove(cards, activeIndex, overIndex);
		updatedCardsJson.splice(overIndex, 1, updatedCard);

		setCards(updatedCardsJson);

		const { error: updateCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updateCardsError) throw updateCardsError;
	}

	return (
		<>
			<div
				ref={setNodeRef}
				{...attributes}
				style={style}
				className="w-64 shrink-0"
			>
				<div
					ref={setActivatorNodeRef}
					{...listeners}
					className="flex items-center justify-between mb-2"
				>
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
							index={index}
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
				<div className="space-y-2">
					{filteredCards.map((card, index) => (
						<div key={card.id} className="relative">
							<Card
								index={index}
								boardId={boardId}
								columnId={column.id}
								card={card}
								cards={cards}
							/>
							<CardOptionsDropdown
								index={index}
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
