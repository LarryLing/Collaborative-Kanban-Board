import { useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce';
import { TypedSupabaseClient } from '@/lib/types';

export default function useBoardTitle(supabase: TypedSupabaseClient, boardId: string) {
    const boardTitleRef = useRef<HTMLInputElement | null>(null);

    const editTitle = useDebouncedCallback(async (oldTitle: string, newTitle: string) => {
        if (oldTitle === newTitle) return;

        const { error: updateTitleError } = await supabase
            .from("boards")
            .update({
                title: newTitle,
            })
            .eq("id", boardId);

        if (updateTitleError) throw updateTitleError;
    }, 1000);

  return { editTitle, boardTitleRef };
}
