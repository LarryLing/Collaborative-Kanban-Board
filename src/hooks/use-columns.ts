import { updateColumnsByBoardId } from '@/lib/queries';
import { Column, ColumnColorOptions, TypedSupabaseClient } from '@/lib/types'
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react'

export type UseColumnsType = {
    columns: Column[];
    createColumn: () => Promise<void>
    deleteColumn: (columnId: string) => Promise<void>
    changeColumnColor: (oldTextColor: ColumnColorOptions, newTextColor: ColumnColorOptions, columnId: string) => Promise<void>
    renameColumn: (oldTitle: string, newTitle: string, columnId: string) => Promise<void>
    moveColumn: (from: number, to: number) => Promise<void>
}

export default function useColumns(supabase: TypedSupabaseClient, boardId: string, fetchedColumns: Column[]) {
    const [columns, setColumns] = useState<Column[]>(fetchedColumns);

    useEffect(() => {
        async function setSupabaseAuth() {
            await supabase.realtime.setAuth()
        }

        setSupabaseAuth();

        const columnsChannel = supabase
            .channel(`columns:${boardId}`)
            .on(
                'broadcast',
                { event: 'UPDATE' },
                (payload) => {
                    setColumns(payload.payload.columns as Column[])
                })
            .subscribe()

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
                title: "Untitled Column",
                color: "text-primary",
            },
        ] as Column[];

        await updateColumnsByBoardId(supabase, boardId, updatedColumns);
    }, [columns])

    const deleteColumn = useCallback(async (columnId: string) => {
		const updatedColumns = columns.filter(
			(columns) => columns.id !== columnId,
		);

        await updateColumnsByBoardId(supabase, boardId, updatedColumns);
	}, [columns])

    const changeColumnColor = useCallback(async (oldTextColor: ColumnColorOptions, newTextColor: ColumnColorOptions, columnId: string) => {
        if (oldTextColor === newTextColor) return;

        const updatedColumns = columns.map((column) =>
            column.id === columnId
                ? {
                        ...column,
                        color: newTextColor,
                    }
                : column,
        )

        await updateColumnsByBoardId(supabase, boardId, updatedColumns);
    }, [columns])

    const renameColumn = useCallback(async (oldTitle: string, newTitle: string, columnId: string) => {
        if (oldTitle === newTitle) return;

        const updatedColumns = columns.map((column) =>
			column.id === columnId
				? {
						...column,
						title: newTitle,
					}
				: column,
		);

        await updateColumnsByBoardId(supabase, boardId, updatedColumns);
    }, [columns])

    const moveColumn = useCallback(async (from: number, to: number) => {
        const updatedColumns = arrayMove(columns, from, to);

        setColumns(updatedColumns);
        await updateColumnsByBoardId(supabase, boardId, updatedColumns);
    }, [columns])

    return {columns, createColumn, deleteColumn, changeColumnColor, renameColumn, moveColumn} as UseColumnsType;
}

