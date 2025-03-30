"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Column from "./column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column as ColumnType } from "@/lib/types";

type BoardClientComponentProps = {
	boardId: string;
	fetchedColumns: ColumnType[];
};

export default function BoardClientComponent({
	boardId,
	fetchedColumns,
}: BoardClientComponentProps) {
	const supabase = createClient();

	const [columns, setColumns] = useState<ColumnType[]>(fetchedColumns);

	useEffect(() => {
		const columnsChannel = supabase
			.channel("realtime columns")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "columns",
				},
				(payload) => {
					setColumns(payload.new.columns as ColumnType[]);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(columnsChannel);
		};
	}, [supabase, columns, setColumns]);

	async function createColumn() {
		const newColumnId = crypto.randomUUID();

		const updatedColumnsJson = [
			...columns,
			{
				id: newColumnId,
				title: "New Column",
				color: "text-primary",
			},
		] as ColumnType[];

		const { error: newColumnError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumnsJson,
			})
			.eq("board_id", boardId);

		if (newColumnError) throw newColumnError;

		const { error: newCardsError } = await supabase
			.from("cards")
			.insert({ column_id: newColumnId, board_id: boardId });

		if (newCardsError) throw newCardsError;
	}

	return (
		<div className="flex gap-4 w-full overflow-auto pb-4">
			{columns.map((column, index) => (
				<Column
					key={column.id}
					index={index}
					boardId={boardId}
					column={column}
					columns={columns}
				/>
			))}
			<Button variant="ghost" onClick={() => createColumn()}>
				<Plus />
				<span>New Column</span>
			</Button>
		</div>
	);
}
