import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { events } from "aws-amplify/data";

import { getAllLists, createList, deleteList, updateList, updateListPosition } from "@/api/lists";
import type { Board, List, UseListsReturnType } from "@/lib/types";
import { useEffect } from "react";
import { EVENT_TYPE_CREATE, EVENT_TYPE_DELETE, EVENT_TYPE_UPDATE, EVENT_TYPE_UPDATE_POSITION } from "@/lib/constants";

import { EVENTS_ENDPOINT, EVENTS_REGION, EVENTS_DEFAULT_AUTH_MODE, EVENTS_API_KEY } from "@/lib/constants";
import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    Events: {
      endpoint: EVENTS_ENDPOINT,
      region: EVENTS_REGION,
      defaultAuthMode: EVENTS_DEFAULT_AUTH_MODE,
      apiKey: EVENTS_API_KEY,
    },
  },
});

export function useLists(boardId: Board["id"]): UseListsReturnType {
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists", boardId],
    queryFn: async () => {
      return await getAllLists({ boardId });
    },
  });

  const { mutateAsync: createListMutation } = useMutation({
    mutationKey: ["createList"],
    mutationFn: createList,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lists", variables.boardId],
      });

      const prevLists: List[] | undefined = queryClient.getQueryData(["lists", variables.boardId]);

      if (!prevLists) return prevLists;

      const newList: List = {
        id: variables.listId,
        board_id: boardId,
        title: variables.listTitle,
        position: variables.listPosition,
      };

      const nextLists = [...prevLists, newList];

      queryClient.setQueryData(["lists", variables.boardId], nextLists);

      return { prevLists };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        type: EVENT_TYPE_CREATE,
        new: {
          id: variables.listId,
          board_id: variables.boardId,
          title: variables.listTitle,
          position: variables.listPosition,
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  const { mutateAsync: deleteListMutation } = useMutation({
    mutationKey: ["deleteList"],
    mutationFn: deleteList,
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
    onError: (error, variables, context) => {
      toast.error("Failed to delete list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        type: EVENT_TYPE_DELETE,
        old: {
          id: variables.listId,
        },
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
    mutationKey: ["updateList"],
    mutationFn: updateList,
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
    onError: (error, variables, context) => {
      toast.error("Failed to update list", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        type: EVENT_TYPE_UPDATE,
        old: {
          id: variables.listId,
          title: variables.listTitle,
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  const { mutateAsync: updateListPositionMutation } = useMutation({
    mutationKey: ["updateListPosition"],
    mutationFn: updateListPosition,
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
    onError: (error, variables, context) => {
      toast.error("Failed to update list position", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["lists", variables.boardId], context?.prevLists);
    },
    onSettled: async (_data, _error, variables) => {
      await events.post(`/default/lists/${variables.boardId}`, {
        type: EVENT_TYPE_UPDATE,
        old: {
          id: variables.listId,
          position: variables.listPosition,
        },
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
        error: (error) => {
          console.error(error);
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
    lists,
    isLoading,
    createListMutation,
    deleteListMutation,
    updateListMutation,
    updateListPositionMutation,
  };
}
