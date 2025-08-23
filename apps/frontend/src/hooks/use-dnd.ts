import { LIST } from "@/lib/constants";
import type { Board, Card, DndData, List, UseCardsReturnType, UseListsReturnType } from "@/lib/types";
import type { DragStart, DragUpdate, DropResult, ResponderProvided } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { generateKeyBetween } from "fractional-indexing";

export function useDnd(
  boardId: Board["id"],
  lists: List[] | undefined,
  cards: Card[] | undefined,
  updateCardPositionMutation: UseCardsReturnType["updateCardPositionMutation"],
  updateListPositionMutation: UseListsReturnType["updateListPositionMutation"],
) {
  const [dndData, setDndData] = useState<DndData>({
    cards: {},
    lists: {},
    listOrder: [],
  });

  useEffect(() => {
    if (!lists || !cards) return;

    setDndData({
      cards: cards.reduce(
        (acc, card) => {
          acc[card.id] = card;
          return acc;
        },
        {} as DndData["cards"],
      ),
      lists: lists.reduce(
        (acc, list) => {
          acc[list.id] = {
            ...list,
            cardIds: cards.filter((card) => card.list_id === list.id).map((card) => card.id),
          };
          return acc;
        },
        {} as DndData["lists"],
      ),
      listOrder: lists.map((list) => list.id),
    });
  }, [lists, cards]);

  const handleDragStart = (start: DragStart, provided: ResponderProvided) => {
    const message = `You have lifted the card in position ${start.source.index + 1}`;
    provided.announce(message);
  };

  const handleDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    const message = update.destination
      ? `You have moved the card in position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;
    provided.announce(message);
  };

  const handleDragEnd = async (result: DropResult, provided: ResponderProvided) => {
    const message = result.destination
      ? `You have moved the card from position ${result.source.index + 1} to position ${result.destination.index + 1}`
      : `You have returned the card to its original position of ${result.source.index + 1}`;
    provided.announce(message);

    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === LIST) {
      const newListOrder = [...dndData.listOrder];
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);

      let newListPosition: string;
      if (destination.index === 0) {
        const afterListId = newListOrder[1];
        const afterList = dndData.lists[afterListId];

        newListPosition = generateKeyBetween(null, afterList.position);
      } else if (destination.index === newListOrder.length - 1) {
        const beforeListId = newListOrder[destination.index - 1];
        const beforeList = dndData.lists[beforeListId];

        newListPosition = generateKeyBetween(beforeList.position, null);
      } else {
        const beforeListId = newListOrder[destination.index - 1];
        const beforeList = dndData.lists[beforeListId];

        const afterListId = newListOrder[destination.index + 1];
        const afterList = dndData.lists[afterListId];

        newListPosition = generateKeyBetween(beforeList.position, afterList.position);
      }

      const newList = {
        ...dndData.lists[draggableId],
        position: newListPosition,
      };

      const newData = {
        ...dndData,
        lists: {
          ...dndData.lists,
          [newList.id]: newList,
        },
        listOrder: newListOrder,
      };

      setDndData(newData);

      await updateListPositionMutation({
        boardId,
        listId: newList.id,
        listPosition: newList.position,
      });

      return;
    }

    const sourceList = dndData.lists[source.droppableId];
    const destinationList = dndData.lists[destination.droppableId];

    if (sourceList.id === destinationList.id) {
      const newCardIds = [...sourceList.cardIds];
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      let newCardPosition: string;
      if (destination.index === 0) {
        const afterCardId = newCardIds[1];
        const afterCard = dndData.cards[afterCardId];

        newCardPosition = generateKeyBetween(null, afterCard.position);
      } else if (destination.index === newCardIds.length - 1) {
        const beforeCardId = newCardIds[destination.index - 1];
        const beforeCard = dndData.cards[beforeCardId];

        newCardPosition = generateKeyBetween(beforeCard.position, null);
      } else {
        const beforeCardId = newCardIds[destination.index - 1];
        const beforeCard = dndData.cards[beforeCardId];

        const afterCardId = newCardIds[destination.index + 1];
        const afterCard = dndData.cards[afterCardId];

        newCardPosition = generateKeyBetween(beforeCard.position, afterCard.position);
      }

      const newCard = {
        ...dndData.cards[draggableId],
        position: newCardPosition,
      };

      const newList = {
        ...sourceList,
        cardIds: newCardIds,
      };

      const newData = {
        ...dndData,
        cards: {
          ...dndData.cards,
          [newCard.id]: newCard,
        },
        lists: {
          ...dndData.lists,
          [newList.id]: newList,
        },
      };

      setDndData(newData);

      await updateCardPositionMutation({
        boardId,
        listId: newList.id,
        cardId: newCard.id,
        cardPosition: newCard.position,
        newListId: newList.id,
      });

      return;
    }

    const sourceCardIds = [...sourceList.cardIds];
    sourceCardIds.splice(source.index, 1);
    const newSourceList = {
      ...sourceList,
      cardIds: sourceCardIds,
    };

    const destinationCardIds = [...destinationList.cardIds];
    destinationCardIds.splice(destination.index, 0, draggableId);
    const newDestinationList = {
      ...destinationList,
      cardIds: destinationCardIds,
    };

    let newCardPosition: string;
    if (newDestinationList.cardIds.length === 1) {
      newCardPosition = generateKeyBetween(null, null);
    } else {
      if (destination.index === 0) {
        const afterCardId = newDestinationList.cardIds[1];
        const afterCard = dndData.cards[afterCardId];

        newCardPosition = generateKeyBetween(null, afterCard.position);
      } else if (destination.index === newDestinationList.cardIds.length - 1) {
        const beforeCardId = newDestinationList.cardIds[destination.index - 1];
        const beforeCard = dndData.cards[beforeCardId];

        newCardPosition = generateKeyBetween(beforeCard.position, null);
      } else {
        const beforeCardId = newDestinationList.cardIds[destination.index - 1];
        const beforeCard = dndData.cards[beforeCardId];

        const afterCardId = newDestinationList.cardIds[destination.index + 1];
        const afterCard = dndData.cards[afterCardId];

        newCardPosition = generateKeyBetween(beforeCard.position, afterCard.position);
      }
    }

    const newCard = {
      ...dndData.cards[draggableId],
      list_id: newDestinationList.id,
      position: newCardPosition,
    };

    const newData = {
      ...dndData,
      cards: {
        ...dndData.cards,
        [newCard.id]: newCard,
      },
      lists: {
        ...dndData.lists,
        [newSourceList.id]: newSourceList,
        [newDestinationList.id]: newDestinationList,
      },
    };

    setDndData(newData);

    await updateCardPositionMutation({
      boardId,
      listId: newSourceList.id,
      cardId: newCard.id,
      cardPosition: newCard.position,
      newListId: newDestinationList.id,
    });
  };

  return { dndData, handleDragStart, handleDragUpdate, handleDragEnd };
}
