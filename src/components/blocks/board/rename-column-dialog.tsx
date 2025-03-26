"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Column } from "../../../../database.types";
import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RenameColumnDialogProps = {
	boardId: string;
	columnId: string;
	columnTitle: string;
	columns: Column[];
	isRenameColumnDialogOpen: boolean;
	setIsRenameColumnDialogOpen: (arg0: boolean) => void;
};

export default function RenameColumnDialog({
	boardId,
	columnId,
	columnTitle,
	columns,
	isRenameColumnDialogOpen,
	setIsRenameColumnDialogOpen,
}: RenameColumnDialogProps) {
	const [pending, setPending] = useState(false);
	const titleRef = useRef<HTMLInputElement>(null);

	async function renameCard(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setPending(true);

		const supabase = createClient();

		let updatedColumns: Column[] = [...columns];
		for (let i = 0; i < updatedColumns.length; i++) {
			if (updatedColumns[i].id === columnId) {
				updatedColumns[i].title =
					titleRef.current?.value || "Untitled Column";
			}
		}

		const { error: updateColumnsError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumns,
			})
			.eq("board_id", boardId);

		setPending(false);
		setIsRenameColumnDialogOpen(false);

		if (updateColumnsError) throw updateColumnsError;
	}

	return (
		<Dialog
			open={isRenameColumnDialogOpen}
			onOpenChange={setIsRenameColumnDialogOpen}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rename Column</DialogTitle>
					<DialogDescription>
						Please enter a new name for this column
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={(e) => renameCard(e)}>
					<Input
						ref={titleRef}
						id="title"
						name="title"
						placeholder="Column Title"
						defaultValue={columnTitle}
						className="col-span-3"
					/>
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="button"
							variant="outline"
							disabled={pending}
							onClick={() => setIsRenameColumnDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={pending}
							className="mb-2 sm:mb-0"
						>
							{pending ? "Renaming..." : "Rename"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
