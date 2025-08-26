import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Board, Card, List, UseCardsReturnType } from "@/lib/types";

import { createCard, deleteCard, getAllCards, updateCard, updateCardPosition } from "@/api/cards";

export function useCards(boardId: Board["id"]): UseCardsReturnType {
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryFn: async () => {
      return await getAllCards({ boardId });
    },
    queryKey: ["cards", boardId],
  });

  const { mutateAsync: createCardMutation } = useMutation({
    mutationFn: createCard,
    mutationKey: ["createCard"],
    onError: (error, variables, context: { prevCards: Card[] } | undefined) => {
      toast.error("Failed to create card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const newCard: Card = {
        board_id: boardId,
        description: variables.cardDescription,
        id: variables.cardId,
        list_id: variables.listId,
        position: variables.cardPosition,
        title: variables.cardTitle,
      };

      const nextCards = [...prevCards, newCard];

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: deleteCardMutation } = useMutation({
    mutationFn: deleteCard,
    mutationKey: ["deleteCard"],
    onError: (error, variables, context: { prevCards: Card[] } | undefined) => {
      toast.error("Failed to delete card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const nextCards = prevCards.filter((prevCards) => prevCards.id !== variables.cardId);

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardMutation } = useMutation({
    mutationFn: updateCard,
    mutationKey: ["updateCard"],
    onError: (error, variables, context: { prevCards: List[] } | undefined) => {
      toast.error("Failed to update card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: List[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const nextCards = prevCards.map((prevlist) =>
        prevlist.id === variables.cardId
          ? {
              ...prevlist,
              description: variables.cardDescription,
              title: variables.cardTitle,
            }
          : prevlist,
      );

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardPositionMutation } = useMutation({
    mutationFn: updateCardPosition,
    mutationKey: ["updateCardPosition"],
    onError: (error, variables, context: { prevCards: List[] } | undefined) => {
      toast.error("Failed to update card position", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: List[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const nextCards = prevCards
        .map((prevlist) =>
          prevlist.id === variables.cardId
            ? {
                ...prevlist,
                list_id: variables.listId,
                position: variables.cardPosition,
              }
            : prevlist,
        )
        .sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  return {
    cards,
    createCardMutation,
    deleteCardMutation,
    isLoading,
    updateCardMutation,
    updateCardPositionMutation,
  };
}
