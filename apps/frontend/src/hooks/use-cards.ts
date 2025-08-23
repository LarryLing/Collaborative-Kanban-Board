import type { Board, Card, List, UseCardsReturnType } from "@/lib/types";
import { getAllCards, createCard, deleteCard, updateCard, updateCardPosition } from "@/api/cards";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCards(boardId: Board["id"]): UseCardsReturnType {
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards", boardId],
    queryFn: async () => {
      return await getAllCards({ boardId });
    },
  });

  const { mutateAsync: createCardMutation } = useMutation({
    mutationKey: ["createCard"],
    mutationFn: createCard,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const newCard: Card = {
        id: variables.cardId,
        board_id: boardId,
        list_id: variables.listId,
        title: variables.cardTitle,
        description: variables.cardDescription,
        position: variables.cardPosition,
      };

      const nextCards = [...prevCards, newCard];

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: deleteCardMutation } = useMutation({
    mutationKey: ["deleteCard"],
    mutationFn: deleteCard,
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
    onError: (error, variables, context) => {
      toast.error("Failed to delete card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardMutation } = useMutation({
    mutationKey: ["updateCard"],
    mutationFn: updateCard,
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
              title: variables.cardTitle,
              description: variables.cardDescription,
            }
          : prevlist,
      );

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardPositionMutation } = useMutation({
    mutationKey: ["updateCardPosition"],
    mutationFn: updateCardPosition,
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
    onError: (error, variables, context) => {
      toast.error("Failed to update card position", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  return {
    cards,
    isLoading,
    createCardMutation,
    deleteCardMutation,
    updateCardMutation,
    updateCardPositionMutation,
  };
}
