import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Board, Card, UseCardsReturnType } from "@/lib/types";

import { createCard, deleteCard, getAllCards, updateCard, updateCardPosition } from "@/api/cards";
import { EVENT_TYPE_CREATE, EVENT_TYPE_DELETE, EVENT_TYPE_UPDATE, EVENT_TYPE_UPDATE_POSITION } from "@/lib/constants";
import { useEffect } from "react";
import { events } from "aws-amplify/api";
import { useNavigate } from "@tanstack/react-router";

export function useCards(boardId: Board["id"]): UseCardsReturnType {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cards, isLoading } = useQuery({
    queryFn: async () => {
      try {
        return await getAllCards({ boardId });
      } catch (error) {
        if (error instanceof Error && error.message === "User is not a board collaborator") {
          navigate({ to: "/boards" });
        }
      }
    },
    queryKey: ["cards", boardId],
  });

  useEffect(() => {
    const channel = events.connect(`/default/cards/${boardId}`);
    channel.then((ch) => {
      ch.subscribe({
        next: (data) => {
          if (data.type === EVENT_TYPE_CREATE) {
            const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", boardId]);

            if (!prevCards) return prevCards;

            const nextCards = [...prevCards, data.new as Card];

            queryClient.setQueryData(["cards", boardId], nextCards);
          } else if (data.type === EVENT_TYPE_UPDATE) {
            const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", boardId]);

            if (!prevCards) return prevCards;

            const { id, title, description } = data.new as Pick<Card, "id" | "title" | "description">;

            const nextCards = prevCards.map((prevCard) =>
              prevCard.id === id ? { ...prevCard, title, description } : prevCard,
            );

            queryClient.setQueryData(["cards", boardId], nextCards);
          } else if (data.type === EVENT_TYPE_UPDATE_POSITION) {
            const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", boardId]);

            if (!prevCards) return prevCards;

            const { id, list_id, position } = data.new as Pick<Card, "id" | "list_id" | "position">;

            const nextCards = prevCards
              .map((prevCard) => (prevCard.id === id ? { ...prevCard, list_id, position } : prevCard))
              .sort((a, b) => {
                if (a.position < b.position) return -1;
                if (a.position > b.position) return 1;
                return 0;
              });

            queryClient.setQueryData(["cards", boardId], nextCards);
          } else if (data.type === EVENT_TYPE_DELETE) {
            const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", boardId]);

            if (!prevCards) return prevCards;

            const { id } = data.old as Pick<Card, "id">;

            const nextCards = prevCards.filter((prevCard) => prevCard.id !== id);

            queryClient.setQueryData(["cards", boardId], nextCards);
          }

          queryClient.invalidateQueries({
            queryKey: ["cards", boardId],
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
    });

    return () => {
      channel?.then((ch) => ch?.close());
    };
  }, [boardId, queryClient]);

  const { mutateAsync: createCardMutation } = useMutation({
    mutationFn: createCard,
    mutationKey: ["createCard"],
    onError: (error, variables, context: { prevCards: Card[] } | undefined) => {
      toast.error("Failed to create card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

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
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/cards/${variables.boardId}`, {
        new: {
          board_id: variables.boardId,
          id: variables.cardId,
          list_id: variables.listId,
          position: variables.cardPosition,
          title: variables.cardTitle,
          description: variables.cardDescription,
        },
        type: EVENT_TYPE_CREATE,
      });

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

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

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
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/cards/${variables.boardId}`, {
        old: {
          id: variables.cardId,
        },
        type: EVENT_TYPE_DELETE,
      });

      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardMutation } = useMutation({
    mutationFn: updateCard,
    mutationKey: ["updateCard"],
    onError: (error, variables, context: { prevCards: Card[] } | undefined) => {
      toast.error("Failed to update card", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const nextCards = prevCards.map((prevCard) =>
        prevCard.id === variables.cardId
          ? {
              ...prevCard,
              description: variables.cardDescription,
              title: variables.cardTitle,
            }
          : prevCard,
      );

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/cards/${variables.boardId}`, {
        old: {
          id: variables.cardId,
          title: variables.cardTitle,
          description: variables.cardDescription,
        },
        type: EVENT_TYPE_UPDATE,
      });

      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateCardPositionMutation } = useMutation({
    mutationFn: updateCardPosition,
    mutationKey: ["updateCardPosition"],
    onError: (error, variables, context: { prevCards: Card[] } | undefined) => {
      toast.error("Failed to update card position", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

      queryClient.setQueryData(["cards", variables.boardId], context?.prevCards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["cards", variables.boardId],
      });

      const prevCards: Card[] | undefined = queryClient.getQueryData(["cards", variables.boardId]);

      if (!prevCards) return prevCards;

      const nextCards = prevCards
        .map((prevCard) =>
          prevCard.id === variables.cardId
            ? {
                ...prevCard,
                list_id: variables.listId,
                position: variables.cardPosition,
              }
            : prevCard,
        )
        .sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });

      queryClient.setQueryData(["cards", variables.boardId], nextCards);

      return { prevCards };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/cards/${variables.boardId}`, {
        old: {
          id: variables.cardId,
          list_id: variables.listId,
          position: variables.cardPosition,
        },
        type: EVENT_TYPE_UPDATE_POSITION,
      });

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
