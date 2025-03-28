"use client";

import { Card as CardType } from "../../../../database.types";
import React, { useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getDateString } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { createClient } from "@/lib/supabase/client";

type CardProps = {
	index: number;
	boardId: string;
	card: CardType;
	cards: CardType[];
};

export default function Card({ index, boardId, card, cards }: CardProps) {
	const supabase = createClient();

	const [saveStatus, setSaveStatus] = useState<"Saving..." | "Saved">(
		"Saved",
	);

	const titleRef = useRef<HTMLInputElement | null>(null);
	const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

	const debounceUpdateCards = useDebouncedCallback(async () => {
		const updatedCard = {
			...card,
			title: titleRef.current?.value || "Untitled Card",
			description: descriptionRef.current?.value || "",
		} as CardType;

		const updatedCardsJson = [...cards];
		updatedCardsJson.splice(index, 1, updatedCard);

		const { error: updateCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		setSaveStatus("Saved");

		if (updateCardsError) throw updateCardsError;
	}, 2000);

	async function handleEdit() {
		setSaveStatus("Saving...");

		await debounceUpdateCards();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div
					draggable
					className="text-sm font-semibold w-full h-[50px] border border-border rounded-md overflow-hidden flex justify-start items-center px-4 py-2 hover:cursor-pointer hover:bg-accent/60 hover:text-accent-foreground transition-colors active:cursor-grabbing"
				>
					<span>{card.title}</span>
				</div>
			</DialogTrigger>
			<DialogContent className="flex flex-col size-[500px] px-8">
				<DialogHeader
					className="hover:cursor-text"
					aria-description={card.title}
				>
					<DialogTitle>
						<Input
							ref={titleRef}
							id="title"
							name="title"
							className="resize-none border-none focus-visible:ring-0 p-0 md:text-lg shadow-none"
							placeholder="New Card"
							defaultValue={card.title}
							onChange={() => handleEdit()}
						/>
					</DialogTitle>
				</DialogHeader>
				<Textarea
					ref={descriptionRef}
					id="description"
					name="description"
					className="h-full resize-none border-none focus-visible:ring-0 p-0 shadow-none"
					placeholder="Enter some description text..."
					defaultValue={card.description}
					onChange={() => handleEdit()}
				/>
				<DialogFooter className="flex-row sm:justify-between text-sm text-muted-foreground">
					<div>{saveStatus}</div>
					<span>Created {getDateString(card.created_at)}</span>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
