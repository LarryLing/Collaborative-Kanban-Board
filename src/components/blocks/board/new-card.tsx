"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type NewCardProps = {
	size: "default" | "icon";
};

export default function NewCard({ size }: NewCardProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{size === "default" ? (
					<Button
						draggable="true"
						variant="outline"
						className="w-full active:cursor-grabbing h-[50px]"
					>
						<Plus className="size-4" />
						<span className="font-semibold text-md">New Card</span>
					</Button>
				) : (
					<Button size="icon">
						<Plus />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="flex flex-col size-[500px] px-8">
				<DialogHeader className="hover:cursor-text">
					<DialogTitle>
						<Input
							className="resize-none border-none focus-visible:ring-0 p-0 md:text-lg"
							placeholder="New Card"
							defaultValue="New Card"
						/>
					</DialogTitle>
				</DialogHeader>
				<Textarea
					className="h-full resize-none border-none focus-visible:ring-0 p-0"
					placeholder="Enter some description text..."
				/>
			</DialogContent>
		</Dialog>
	);
}
