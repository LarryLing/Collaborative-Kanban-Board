import { Card, TypedSupabaseClient } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react'
import { arrayMove } from "@dnd-kit/sortable";

export type UseCardsType = {
    cards: Card[];
    createCard: (columnId: string, title: string, description: string) => Promise<void>
    deleteCard: (deletedCardId: string) => Promise<void>
    deleteCardsByColumnId: (columnId: string) => Promise<void>
    duplicateCard: (card: Card) => Promise<void>
    moveCardToColumn: (cardId: string, columnId: string) => Promise<void>
    moveCard: (from: number, to: number) => Promise<void>
    editCard: (cardId: string, title: string, description: string) => Promise<void>
}

export default function useCards(supabase: TypedSupabaseClient, boardId: string, fetchedCards: Card[]) {
    const [cards, setCards] = useState<Card[]>(fetchedCards);

    useEffect(() => {
        const cardsChannel = supabase
            .channel(`reatime cards`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "cards",
                },
                (payload) => {
                    setCards(payload.new.cards as Card[]);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(cardsChannel);
        };
    }, [supabase, cards, setCards]);

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

        await updateCards(updatedCards);
    }, [cards])

    const deleteCard = useCallback(async (deletedCardId: string) => {
        const updatedCards = cards.filter(
			(card) => card.id !== deletedCardId,
		);

		await updateCards(updatedCards);
    }, [cards])

    const deleteCardsByColumnId = useCallback(async (columnId: string) => {
        const updatedCards = cards.filter(
            (card) => card.column_id !== columnId,
        );

        await updateCards(updatedCards);
    }, [cards])

    const duplicateCard = useCallback(async (card: Card) => {
        const duplicatedCard = {
            ...card,
            id: crypto.randomUUID(),
        } as Card;

        const index = cards.findIndex((idxCard) => idxCard.id === card.id);
        let updatedCards = [...cards];
        updatedCards.splice(index, 0, duplicatedCard);

        await updateCards(updatedCards);
    }, [cards])

    const moveCardToColumn = useCallback(async (cardId: string, columnId: string) => {
        const updatedCards = cards.map((card) =>
			card.id === cardId
				? {
						...card,
						column_id: columnId,
					}
				: card,
		);

		await updateCards(updatedCards);
    }, [cards])

    const moveCard = useCallback(async (from: number, to: number) => {
        const updatedCards = arrayMove(cards, from, to);

        await updateCards(updatedCards);
    }, [cards])

    const editCard = useCallback(async (cardId: string, title: string, description: string) => {
        const updatedCards = cards.map((card) =>
			card.id === cardId
				? {
						...card,
						title: title,
						description: description
					}
				: card,
		);

		await updateCards(updatedCards);
    }, [cards])

    const updateCards = useCallback(async (updatedCards: Card[]) => {
        setCards(updatedCards);

        const { error: updatedCardsError } = await supabase
            .from("cards")
            .update({
                cards: updatedCards,
            })
            .eq("board_id", boardId);

        if (updatedCardsError) throw updatedCardsError;
    }, [])

    return {cards, createCard, deleteCard, deleteCardsByColumnId, duplicateCard, moveCardToColumn, moveCard, editCard} as UseCardsType;
}
