import { LIST, CARD } from "@/lib/constants";
import type { Card, Container, List } from "@/lib/types";
import type {
  Active,
  Over,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import { useState, useEffect } from "react";

export function useDND(lists: List[] | undefined, cards: Card[] | undefined) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [activeList, setActiveList] = useState<List | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  useEffect(() => {
    if (!lists || !cards) return;

    setContainers(
      lists.map((list) => {
        return {
          list,
          cards: cards.filter((card) => card.list_id === list.id),
        };
      }),
    );
  }, [lists, cards]);

  const findContainer = (object: Active | Over) => {
    if (object.data.current?.type === LIST) {
      return containers.find(
        (container) =>
          container.list.id === (object.data.current?.list as List).id,
      );
    } else if (object.data.current?.type === CARD) {
      return containers.find(
        (container) =>
          container.list.id === (object.data.current?.card as Card).list_id,
      );
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!lists || !cards) return;

    const { active } = event;

    if (active.data.current?.type === LIST) {
      setActiveList(active.data.current?.list as List);
    } else if (active.data.current?.type === CARD) {
      setActiveCard(active.data.current?.card as Card);
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    if (!lists || !cards) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeContainer = findContainer(active);
    const overContainer = findContainer(over);

    if (!activeContainer || !overContainer) return;

    const activeContainerIndex = containers.findIndex(
      (container) => container.list.id === activeContainer.list.id,
    );
    const overContainerIndex = containers.findIndex(
      (container) => container.list.id === overContainer.list.id,
    );

    if (active.data.current?.type === LIST) {
      let newListPosition;
      if (activeContainerIndex < overContainerIndex) {
        if (overContainerIndex + 1 >= containers.length) {
          newListPosition = generateKeyBetween(
            containers[overContainerIndex].list.position,
            null,
          );
        } else {
          newListPosition = generateKeyBetween(
            containers[overContainerIndex].list.position,
            containers[overContainerIndex + 1].list.position,
          );
        }
      } else if (activeContainerIndex > overContainerIndex) {
        if (overContainerIndex - 1 < 0) {
          newListPosition = generateKeyBetween(
            null,
            containers[overContainerIndex].list.position,
          );
        } else {
          newListPosition = generateKeyBetween(
            containers[overContainerIndex - 1].list.position,
            containers[overContainerIndex].list.position,
          );
        }
      } else {
        return;
      }

      setContainers((prevContainers) => {
        return arrayMove(
          prevContainers,
          activeContainerIndex,
          overContainerIndex,
        ).map((container) => {
          if (container.list.id !== activeContainer.list.id) {
            return {
              ...container,
            };
          }

          return {
            ...container,
            list: {
              ...container.list,
              position: newListPosition,
            },
          };
        });
      });
    } else if (active.data.current?.type === CARD) {
      const activeCard = activeContainer.cards.find(
        (card) => card.id === active.id,
      );
      const overCard = activeContainer.cards.find(
        (card) => card.id === over.id,
      );

      if (!activeCard || !overCard) return;

      const activeCardIndex = activeContainer.cards.findIndex(
        (card) => card.id === activeCard.id,
      );
      const overCardIndex = activeContainer.cards.findIndex(
        (card) => card.id === overCard.id,
      );

      if (activeContainerIndex === overContainerIndex) {
        let newCardPosition;
        if (activeCardIndex < overCardIndex) {
          if (
            overCardIndex + 1 >=
            containers[activeContainerIndex].cards.length
          ) {
            newCardPosition = generateKeyBetween(
              containers[activeContainerIndex].cards[overCardIndex].position,
              null,
            );
          } else {
            newCardPosition = generateKeyBetween(
              containers[activeContainerIndex].cards[overCardIndex].position,
              containers[activeContainerIndex].cards[overCardIndex + 1]
                .position,
            );
          }
        } else if (activeCardIndex > overCardIndex) {
          if (overCardIndex - 1 < 0) {
            newCardPosition = generateKeyBetween(
              null,
              containers[activeContainerIndex].cards[overCardIndex].position,
            );
          } else {
            newCardPosition = generateKeyBetween(
              containers[activeContainerIndex].cards[overCardIndex - 1]
                .position,
              containers[activeContainerIndex].cards[overCardIndex].position,
            );
          }
        } else {
          return;
        }

        setContainers((prevContainers) => {
          return prevContainers.map((prevContainer) => {
            if (prevContainer.list.id !== activeContainer.list.id) {
              return {
                ...prevContainer,
              };
            }

            const updatedCards = arrayMove(
              prevContainer.cards,
              activeCardIndex,
              overCardIndex,
            ).map((card) => {
              if (card.id !== activeCard.id) {
                return {
                  ...card,
                };
              }

              return {
                ...card,
                position: newCardPosition,
              };
            });

            return {
              ...prevContainer,
              cards: updatedCards,
            };
          });
        });
      } else {
        console.log("sorting over different container");
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveList(null);
    setActiveCard(null);

    if (!lists || !cards) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // CONFIRM POSITION UPDATES FOR CARDS OR LISTS DEPENDING ON WHICH ON WAS ACTIVE
  };

  return {
    containers,
    activeList,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
