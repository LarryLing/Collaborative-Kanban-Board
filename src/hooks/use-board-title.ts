import { useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce';
import { TypedSupabaseClient } from '@/lib/types';

export default function useBoardTitle(supabase: TypedSupabaseClient, boardId: string) {
    const boardTitleRef = useRef<HTMLInputElement | null>(null);

    const editTitle = useDebouncedCallback(async () => {
        const { error: updateTitleError } = await supabase
            .from("boards")
            .update({
                title: boardTitleRef.current?.value || "Untitled Board",
            })
            .eq("id", boardId);

        if (updateTitleError) throw updateTitleError;
    }, 1000);

  return { editTitle, boardTitleRef };
}
