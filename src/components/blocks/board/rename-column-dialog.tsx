"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { UseColumnsType } from "@/hooks/use-columns";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PenLine } from "lucide-react";

type RenameColumnDialogProps = {
	columnId: string;
	columnTitle: string;
	renameColumn: UseColumnsType["renameColumn"];
};

export default function RenameColumnDialog({
	columnId,
	columnTitle,
	renameColumn,
}: RenameColumnDialogProps) {
	const [pending, setPending] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setPending(true);

		await renameColumn(
			columnTitle,
			titleRef.current?.value || "Untitled Column",
			columnId,
		);

		setPending(false);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<PenLine className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>
			</DialogTrigger>
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
						defaultValue={columnTitle}
						className="col-span-3"
					/>
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={pending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={pending} className="mb-2 sm:mb-0">
							{pending ? "Renaming..." : "Rename"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
