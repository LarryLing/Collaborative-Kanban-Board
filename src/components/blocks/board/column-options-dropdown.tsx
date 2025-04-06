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
import { Column as ColumnType } from "@/lib/types";
import { UseCardsType } from "@/hooks/use-cards";
import { UseColumnsType } from "@/hooks/use-columns";

type ColumnOptionsDropdownProps = {
	column: ColumnType;
	useCardsObject: UseCardsType;
	useColumnsObject: UseColumnsType;
	setIsRenameColumnDialogOpen: (arg0: boolean) => void;
};

export default function ColumnOptionsDropdown({
	column,
	useCardsObject,
	useColumnsObject,
	setIsRenameColumnDialogOpen,
}: ColumnOptionsDropdownProps) {
	const { theme } = useTheme();

	const { deleteColumn, changeColumnColor } = useColumnsObject;
	const { deleteCardsByColumnId } = useCardsObject;

	async function handleDeleteColumn() {
		const deleteColumnPromise = await deleteColumn(column.id);
		const deleteCardsPromise = await deleteCardsByColumnId(column.id);

		await Promise.all([deleteColumnPromise, deleteCardsPromise]);
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

				<DropdownMenuItem onClick={handleDeleteColumn}>
					<Trash2 className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-primary",
							column.id,
						)
					}
				>
					<div
						className={`${theme === "dark" ? "bg-white" : "bg-black"} rounded-sm size-4`}
					/>
					<span>Default</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-amber-900",
							column.id,
						)
					}
				>
					<div className="bg-amber-900 rounded-sm size-4" />
					<span>Brown</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-orange-400",
							column.id,
						)
					}
				>
					<div className="bg-orange-400 rounded-sm size-4" />
					<span>Orange</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-yellow-400",
							column.id,
						)
					}
				>
					<div className="bg-yellow-400 rounded-sm size-4" />
					<span>Yellow</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-green-800",
							column.id,
						)
					}
				>
					<div className="bg-green-800 rounded-sm size-4" />
					<span>Green</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-blue-500",
							column.id,
						)
					}
				>
					<div className="bg-blue-500 rounded-sm size-4" />
					<span>Blue</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-purple-800",
							column.id,
						)
					}
				>
					<div className="bg-purple-800 rounded-sm size-4" />
					<span>Purple</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-pink-400",
							column.id,
						)
					}
				>
					<div className="bg-pink-400 rounded-sm size-4" />
					<span>Pink</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						changeColumnColor(
							column.color,
							"text-red-600",
							column.id,
						)
					}
				>
					<div className="bg-red-600 rounded-sm size-4" />
					<span>Red</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
