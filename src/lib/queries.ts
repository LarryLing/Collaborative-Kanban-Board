import { Card, Column, TypedSupabaseClient } from "./types";

export async function updateCardsByBoardId(supabase: TypedSupabaseClient, boardId: string, updatedCards: Card[]) {
    const { error: updatedCardsError } = await supabase
        .from("cards")
        .update({
            cards: updatedCards,
        })
        .eq("board_id", boardId);

    if (updatedCardsError) throw updatedCardsError;
}

export async function updateColumnsByBoardId(supabase: TypedSupabaseClient, boardId: string, updatedColumns: Column[]) {
    const { error: updateColumnsError } = await supabase
        .from("columns")
        .update({
            columns: updatedColumns,
        })
        .eq("board_id", boardId);

    if (updateColumnsError) throw updateColumnsError;
}
