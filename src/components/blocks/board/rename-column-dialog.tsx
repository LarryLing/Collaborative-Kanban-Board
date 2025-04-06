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
import { FormEvent, useRef, useState } from "react";
import { Column as ColumnType } from "@/lib/types";
import { UseColumnsType } from "@/hooks/use-columns";

type RenameColumnDialogProps = {
	column: ColumnType;
	renameColumn: UseColumnsType["renameColumn"];
	isRenameColumnDialogOpen: boolean;
	setIsRenameColumnDialogOpen: (arg0: boolean) => void;
};

export default function RenameColumnDialog({
	column,
	renameColumn,
	isRenameColumnDialogOpen,
	setIsRenameColumnDialogOpen,
}: RenameColumnDialogProps) {
	const [pending, setPending] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setPending(true);

		await renameColumn(
            column.title,
			titleRef.current?.value || "Untitled Column",
			column.id,
		);

		setPending(false);
		setIsRenameColumnDialogOpen(false);
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
				<form onSubmit={(e) => handleSubmit(e)}>
					<Input
						ref={titleRef}
						id="title"
						name="title"
						placeholder="Column Title"
						defaultValue={column.title}
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
