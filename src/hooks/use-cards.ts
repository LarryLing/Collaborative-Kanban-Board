import { Card, TypedSupabaseClient } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react'
import { arrayMove } from "@dnd-kit/sortable";
import { updateCardsByBoardId } from '@/lib/queries';

export type UseCardsType = {
    cards: Card[];
    createCard: (columnId: string, title: string, description: string) => Promise<void>
    deleteCard: (deletedCardId: string) => Promise<void>
    deleteCardsByColumnId: (columnId: string) => Promise<void>
    duplicateCard: (card: Card) => Promise<void>
    moveCardToColumn: (cardId: string, oldColumnId: string, newColumnId: string, updateDatabase: boolean) => Promise<void>
    moveCard: (from: number, to: number) => Promise<void>
    editCard: (cardId: string, oldTitle: string, newTitle: string, oldDescription: string, newDescription: string) => Promise<void>
}

export default function useCards(supabase: TypedSupabaseClient, boardId: string, fetchedCards: Card[]) {
    const [cards, setCards] = useState<Card[]>(fetchedCards);

    useEffect(() => {
        async function setSupabaseAuth() {
            await supabase.realtime.setAuth()
        }

        setSupabaseAuth();

        const cardsChannel = supabase
            .channel(`cards:${boardId}`)
            .on(
                'broadcast',
                { event: 'UPDATE' },
                (payload) => {
                    setCards(payload.payload.cards as Card[])
                })
            .subscribe()

        return () => {
            supabase.removeChannel(cardsChannel);
        };
    }, [supabase, cards, setCards, boardId]);

    const createCard = useCallback(async (columnId: string, title: string, description: string) => {
        const updatedCards = [
            ...cards,
            {
                id: crypto.randomUUID(),
                column_id: columnId,
                title: title,
                description: description,
                created_at: new Date().toISOString().toLocaleString(),
            },
        ] as Card[];

        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const deleteCard = useCallback(async (deletedCardId: string) => {
        const updatedCards = cards.filter(
			(card) => card.id !== deletedCardId,
		);

        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const deleteCardsByColumnId = useCallback(async (columnId: string) => {
        const updatedCards = cards.filter(
            (card) => card.column_id !== columnId,
        );

        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const duplicateCard = useCallback(async (card: Card) => {
        const duplicatedCard = {
            ...card,
            id: crypto.randomUUID(),
        } as Card;

        const index = cards.findIndex((idxCard) => idxCard.id === card.id);
        const updatedCards = [...cards];
        updatedCards.splice(index, 0, duplicatedCard);

        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const moveCardToColumn = useCallback((cardId: string, oldColumnId: string, newColumnId: string, updateDatabase: boolean) => {
        if (oldColumnId === newColumnId) return;

        const updatedCards = cards.map((card) =>
			card.id === cardId
				? {
						...card,
						column_id: newColumnId,
					}
				: card,
		);

        setCards(updatedCards);
        if (updateDatabase) updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const moveCard = useCallback(async (from: number, to: number) => {
        const updatedCards = arrayMove(cards, from, to);

        setCards(updatedCards);
        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    const editCard = useCallback(async (cardId: string, oldTitle: string, newTitle: string, oldDescription: string, newDescription: string) => {
        if (oldTitle === newTitle && oldDescription === newDescription) return;

        const updatedCards = cards.map((card) =>
			card.id === cardId
				? {
						...card,
						title: newTitle,
						description: newDescription
					}
				: card,
		);

        await updateCardsByBoardId(supabase, boardId, updatedCards);
    }, [boardId, cards, supabase])

    return {cards, createCard, deleteCard, deleteCardsByColumnId, duplicateCard, moveCardToColumn, moveCard, editCard} as UseCardsType;
}
