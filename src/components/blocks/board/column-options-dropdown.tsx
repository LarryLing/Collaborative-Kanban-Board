"use client";

import React from "react";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Card as CardType, Column as ColumnType } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { ColumnColorOptions } from "@/lib/types";

type ColumnOptionsDropdownProps = {
	index: number;
	boardId: string;
	cards: CardType[];
	column: ColumnType;
	columns: ColumnType[];
	setIsRenameColumnDialogOpen: (arg0: boolean) => void;
};

export default function ColumnOptionsDropdown({
	index,
	boardId,
	cards,
	column,
	columns,
	setIsRenameColumnDialogOpen,
}: ColumnOptionsDropdownProps) {
	const { theme } = useTheme();

	const supabase = createClient();

	async function deleteColumn() {
		const updatedColumnsJson = columns.filter(
			(filteredColumn) => filteredColumn.id !== column.id,
		);

		const { error: updateColumnsError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (updateColumnsError) throw updateColumnsError;

		const updatedCardsJson = cards.filter(
			(filteredCard) => filteredCard.column_id !== column.id,
		);

		const { error: updatedCardsError } = await supabase
			.from("cards")
			.update({
				cards: updatedCardsJson,
			})
			.eq("board_id", boardId);

		if (updatedCardsError) throw updatedCardsError;
	}

	async function updateColumnColor(textColor: ColumnColorOptions) {
		const updatedColumn = {
			...column,
			color: textColor,
		} as ColumnType;

		const updatedColumnsJson = [...columns];
		updatedColumnsJson.splice(index, 1, updatedColumn);

		const { error: updateColumnsError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (updateColumnsError) throw updateColumnsError;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => setIsRenameColumnDialogOpen(true)}
				>
					<PenLine className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => deleteColumn()}>
					<Trash2 className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-primary")}
				>
					<div
						className={`${theme === "dark" ? "bg-white" : "bg-black"} rounded-sm size-4`}
					/>
					<span>Default</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-amber-900")}
				>
					<div className="bg-amber-900 rounded-sm size-4" />
					<span>Brown</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-orange-400")}
				>
					<div className="bg-orange-400 rounded-sm size-4" />
					<span>Orange</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-yellow-400")}
				>
					<div className="bg-yellow-400 rounded-sm size-4" />
					<span>Yellow</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-green-800")}
				>
					<div className="bg-green-800 rounded-sm size-4" />
					<span>Green</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-blue-500")}
				>
					<div className="bg-blue-500 rounded-sm size-4" />
					<span>Blue</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-purple-800")}
				>
					<div className="bg-purple-800 rounded-sm size-4" />
					<span>Purple</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-pink-400")}
				>
					<div className="bg-pink-400 rounded-sm size-4" />
					<span>Pink</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => updateColumnColor("text-red-600")}
				>
					<div className="bg-red-600 rounded-sm size-4" />
					<span>Red</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
