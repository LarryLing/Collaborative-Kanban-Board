import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import { events } from "aws-amplify/data";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Board, List, UseListsReturnType } from "@/lib/types";

import { createList, deleteList, getAllLists, updateList, updateListPosition } from "@/api/lists";
import { EVENT_TYPE_CREATE, EVENT_TYPE_DELETE, EVENT_TYPE_UPDATE, EVENT_TYPE_UPDATE_POSITION } from "@/lib/constants";
import { EVENTS_API_KEY, EVENTS_DEFAULT_AUTH_MODE, EVENTS_ENDPOINT, EVENTS_REGION } from "@/lib/constants";

Amplify.configure({
  API: {
    Events: {
      apiKey: EVENTS_API_KEY,
      defaultAuthMode: EVENTS_DEFAULT_AUTH_MODE,
      endpoint: EVENTS_ENDPOINT,
      region: EVENTS_REGION,
    },
  },
});

export function useLists(boardId: Board["id"]): UseListsReturnType {
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryFn: async () => {
      return await getAllLists({ boardId });
    },
    queryKey: ["lists", boardId],
  });

  const { mutateAsync: createListMutation } = useMutation({
    mutationFn: createList,
    mutationKey: ["createList"],
    onError: (error, variables, context: { prevLists: List[] } | undefined) => {
      toast.error("Failed to create list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lists", variables.boardId],
      });

      const prevLists: List[] | undefined = queryClient.getQueryData(["lists", variables.boardId]);

      if (!prevLists) return prevLists;

      const newList: List = {
        board_id: boardId,
        id: variables.listId,
        position: variables.listPosition,
        title: variables.listTitle,
      };

      const nextLists = [...prevLists, newList];

      queryClient.setQueryData(["lists", variables.boardId], nextLists);

      return { prevLists };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        new: {
          board_id: variables.boardId,
          id: variables.listId,
          position: variables.listPosition,
          title: variables.listTitle,
        },
        type: EVENT_TYPE_CREATE,
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  const { mutateAsync: deleteListMutation } = useMutation({
    mutationFn: deleteList,
    mutationKey: ["deleteList"],
    onError: (error, variables, context: { prevLists: List[] } | undefined) => {
      toast.error("Failed to delete list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lists", variables.boardId],
      });

      const prevLists: List[] | undefined = queryClient.getQueryData(["lists", variables.boardId]);

      if (!prevLists) return prevLists;

      const nextLists = prevLists.filter((prevLists) => prevLists.id !== variables.listId);

      queryClient.setQueryData(["lists", variables.boardId], nextLists);

      return { prevLists };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        old: {
          id: variables.listId,
        },
        type: EVENT_TYPE_DELETE,
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });

      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateListMutation } = useMutation({
    mutationFn: updateList,
    mutationKey: ["updateList"],
    onError: (error, variables, context: { prevLists: List[] } | undefined) => {
      toast.error("Failed to update list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lists", variables.boardId],
      });

      const prevLists: List[] | undefined = queryClient.getQueryData(["lists", variables.boardId]);

      if (!prevLists) return prevLists;

      const nextLists = prevLists.map((prevlist) =>
        prevlist.id === variables.listId ? { ...prevlist, title: variables.listTitle } : prevlist,
      );

      queryClient.setQueryData(["lists", variables.boardId], nextLists);

      return { prevLists };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        old: {
          id: variables.listId,
          title: variables.listTitle,
        },
        type: EVENT_TYPE_UPDATE,
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateListPositionMutation } = useMutation({
    mutationFn: updateListPosition,
    mutationKey: ["updateListPosition"],
    onError: (error, variables, context: { prevLists: List[] } | undefined) => {
      toast.error("Failed to update list position", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lists", variables.boardId],
      });

      const prevLists: List[] | undefined = queryClient.getQueryData(["lists", variables.boardId]);

      if (!prevLists) return prevLists;

      const nextLists = prevLists
        .map((prevlist) =>
          prevlist.id === variables.listId ? { ...prevlist, position: variables.listPosition } : prevlist,
        )
        .sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });

      queryClient.setQueryData(["lists", variables.boardId], nextLists);

      return { prevLists };
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        old: {
          id: variables.listId,
          position: variables.listPosition,
        },
        type: EVENT_TYPE_UPDATE,
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  useEffect(() => {
    const connectChannel = async () => {
      const channel = await events.connect(`/default/lists/${boardId}`);

      channel.subscribe({
        error: (error) => {
          console.error(error);
        },
        next: (event) => {
          if (event.type === EVENT_TYPE_CREATE) {
            const prevLists: List[] | undefined = queryClient.getQueryData(["lists", boardId]);

            if (!prevLists) return prevLists;

            const nextLists = [...prevLists, event.new as List];

            queryClient.setQueryData(["lists", boardId], nextLists);
          } else if (event.type === EVENT_TYPE_UPDATE) {
            const prevLists: List[] | undefined = queryClient.getQueryData(["lists", boardId]);

            if (!prevLists) return prevLists;

            const { id, title } = event.new as Pick<List, "id" | "title">;

            const nextLists = prevLists.map((prevlist) => (prevlist.id === id ? { ...prevlist, title } : prevlist));

            queryClient.setQueryData(["lists", boardId], nextLists);
          } else if (event.type === EVENT_TYPE_UPDATE_POSITION) {
            const prevLists: List[] | undefined = queryClient.getQueryData(["lists", boardId]);

            if (!prevLists) return prevLists;

            const { id, position } = event.new as Pick<List, "id" | "position">;

            const nextLists = prevLists
              .map((prevlist) => (prevlist.id === id ? { ...prevlist, position } : prevlist))
              .sort((a, b) => {
                if (a.position < b.position) return -1;
                if (a.position > b.position) return 1;
                return 0;
              });

            queryClient.setQueryData(["lists", boardId], nextLists);
          } else if (event.type === EVENT_TYPE_DELETE) {
            const prevLists: List[] | undefined = queryClient.getQueryData(["lists", boardId]);

            if (!prevLists) return prevLists;

            const { id } = event.old as Pick<List, "id">;

            const nextLists = prevLists.filter((prevlist) => prevlist.id !== id);

            queryClient.setQueryData(["lists", boardId], nextLists);
          }

          queryClient.invalidateQueries({
            queryKey: ["lists", boardId],
          });
        },
      });

      return channel;
    };

    let channel: Awaited<ReturnType<typeof events.connect>> | undefined;
    connectChannel().then((ch) => {
      channel = ch;
    });

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [boardId, lists, queryClient]);

  return {
    createListMutation,
    deleteListMutation,
    isLoading,
    lists,
    updateListMutation,
    updateListPositionMutation,
  };
}
