import { LIST } from "@/lib/constants";
import type { Card, DndData, List } from "@/lib/types";
import type { DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

export function useDnd(lists: List[] | undefined, cards: Card[] | undefined) {
  const [data, setData] = useState<DndData>({
    cards: {},
    lists: {},
    listOrder: [],
  });

  useEffect(() => {
    if (!lists || !cards) return;

    setData({
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === LIST) {
      const newListOrder = Array.from(data.listOrder);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...data,
        listOrder: newListOrder,
      };

      setData(newData);
      return;
    }

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];

    if (sourceList.id === destinationList.id) {
      const newCardIds = Array.from(sourceList.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newList = {
        ...sourceList,
        cardIds: newCardIds,
      };

      const newData = {
        ...data,
        lists: {
          ...data.lists,
          [newList.id]: newList,
        },
      };

      setData(newData);
      return;
    }

    const sourceCardIds = Array.from(sourceList.cardIds);
    sourceCardIds.splice(source.index, 1);
    const newSourceList = {
      ...sourceList,
      cardIds: sourceCardIds,
    };

    const destinationCardIds = Array.from(destinationList.cardIds);
    destinationCardIds.splice(destination.index, 0, draggableId);
    const newDestinationList = {
      ...destinationList,
      cardIds: destinationCardIds,
    };

    const newData = {
      ...data,
      lists: {
        ...data.lists,
        [newSourceList.id]: newSourceList,
        [newDestinationList.id]: newDestinationList,
      },
    };

    setData(newData);
  };

  return { data, handleDragEnd };
}
