"use client";

import { Button } from "@/components/ui/button";
import { Card as CardType } from "../../../../database.types";
import React, { useState } from "react";
import DropIndicator from "./drop-indicator";
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

type CardProps = {
	card: CardType;
};

export default function Card({ card }: CardProps) {
	const [isSaving, setIsSaving] = useState(false);

	return (
		<>
			<DropIndicator beforeId={card.id} columnId={card.column_id} />
			<Dialog>
				<DialogTrigger asChild>
					<Button
						draggable="true"
						variant="outline"
						className="justify-start w-full active:cursor-grabbing h-[50px]"
					>
						<span>{card.title}</span>
					</Button>
				</DialogTrigger>
				<DialogContent className="flex flex-col size-[500px] px-8">
					<DialogHeader className="hover:cursor-text">
						<DialogTitle>
							<Input
								className="resize-none border-none focus-visible:ring-0 p-0 md:text-lg shadow-none"
								placeholder="New Card"
								defaultValue={card.title}
							/>
						</DialogTitle>
					</DialogHeader>
					<Textarea
						className="h-full resize-none border-none focus-visible:ring-0 p-0 shadow-none"
						placeholder="Enter some description text..."
						defaultValue={card.description}
					/>
					<DialogFooter className="flex-row sm:justify-between text-sm text-muted-foreground">
						<div>{isSaving ? "Saving..." : ""}</div>
						<span>Created {getDateString(card.created_at)}</span>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
