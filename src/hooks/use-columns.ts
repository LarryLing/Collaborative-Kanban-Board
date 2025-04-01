import { Column, ColumnColorOptions, TypedSupabaseClient } from '@/lib/types'
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react'

export type UseColumnsType = {
    columns: Column[];
    createColumn: () => Promise<void>
    deleteColumn: (columnId: string) => Promise<void>
    changeColumnColor: (textColor: ColumnColorOptions, columnId: string) => Promise<void>
    renameColumn: (newTitle: string, columnId: string) => Promise<void>
    moveColumn: (from: number, to: number) => Promise<void>
}

export default function useColumns(supabase: TypedSupabaseClient, boardId: string, fetchedColumns: Column[]) {
    const [columns, setColumns] = useState<Column[]>(fetchedColumns);

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
                    setColumns(payload.new.columns as Column[]);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(columnsChannel);
        };
    }, [supabase, columns, setColumns]);

    const createColumn = useCallback(async () => {
        const newColumnId = crypto.randomUUID();

        const updatedColumns = [
            ...columns,
            {
                id: newColumnId,
                title: "New Column",
                color: "text-primary",
            },
        ] as Column[];

        await updateColumns(updatedColumns);
    }, [columns])

    const deleteColumn = useCallback(async (columnId: string) => {
		const updatedColumns = columns.filter(
			(columns) => columns.id !== columnId,
		);

        await updateColumns(updatedColumns);
	}, [columns])

    const changeColumnColor = useCallback(async (textColor: ColumnColorOptions, columnId: string) => {
        const updatedColumns = columns.map((column) =>
            column.id === columnId
                ? {
                        ...column,
                        color: textColor,
                    }
                : column,
        )

        await updateColumns(updatedColumns);
    }, [columns])

    const renameColumn = useCallback(async (newTitle: string, columnId: string) => {
        const updatedColumns = columns.map((column) =>
			column.id === columnId
				? {
						...column,
						title: newTitle,
					}
				: column,
		);

		await updateColumns(updatedColumns);
    }, [columns])

    const moveColumn = useCallback(async (from: number, to: number) => {
        const updatedColumns = arrayMove(columns, from, to);

        await updateColumns(updatedColumns);
    }, [columns])

    const updateColumns = useCallback(async (updatedColumns: Column[]) => {
        setColumns(updatedColumns);

        const { error: updateColumnsError } = await supabase
			.from("columns")
			.update({
				columns: updatedColumns,
			})
			.eq("board_id", boardId);

            if (updateColumnsError) throw updateColumnsError;
    }, [])

    return {columns, createColumn, deleteColumn, changeColumnColor, renameColumn, moveColumn} as UseColumnsType;
}

