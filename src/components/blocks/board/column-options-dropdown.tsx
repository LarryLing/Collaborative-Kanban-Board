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
import RenameColumnDialog from "./rename-column-dialog";

type ColumnOptionsDropdownProps = {
	renameColumn: UseColumnsType["renameColumn"];
	deleteColumn: UseColumnsType["deleteColumn"];
	deleteCardsByColumnId: UseCardsType["deleteCardsByColumnId"];
	changeColumnColor: UseColumnsType["changeColumnColor"];
} & ColumnType;

export default function ColumnOptionsDropdown({
	id,
	title,
	color,
	renameColumn,
	deleteColumn,
	deleteCardsByColumnId,
	changeColumnColor,
}: ColumnOptionsDropdownProps) {
	const { theme } = useTheme();

	async function handleDeleteColumn() {
		const deleteColumnPromise = await deleteColumn(id);
		const deleteCardsPromise = await deleteCardsByColumnId(id);

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
				<RenameColumnDialog
					columnId={id}
					columnTitle={title}
					renameColumn={renameColumn}
				/>
				<DropdownMenuItem onClick={handleDeleteColumn}>
					<Trash2 className="size-4" />
					<span>Delete</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-primary", id)}
				>
					<div
						className={`${theme === "dark" ? "bg-white" : "bg-black"} rounded-sm size-4`}
					/>
					<span>Default</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-amber-900", id)}
				>
					<div className="bg-amber-900 rounded-sm size-4" />
					<span>Brown</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-orange-400", id)}
				>
					<div className="bg-orange-400 rounded-sm size-4" />
					<span>Orange</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-yellow-400", id)}
				>
					<div className="bg-yellow-400 rounded-sm size-4" />
					<span>Yellow</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-green-800", id)}
				>
					<div className="bg-green-800 rounded-sm size-4" />
					<span>Green</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-blue-500", id)}
				>
					<div className="bg-blue-500 rounded-sm size-4" />
					<span>Blue</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-purple-800", id)}
				>
					<div className="bg-purple-800 rounded-sm size-4" />
					<span>Purple</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-pink-400", id)}
				>
					<div className="bg-pink-400 rounded-sm size-4" />
					<span>Pink</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeColumnColor(color, "text-red-600", id)}
				>
					<div className="bg-red-600 rounded-sm size-4" />
					<span>Red</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const MemoizedColumnOptionsDropdown = React.memo(ColumnOptionsDropdown);
