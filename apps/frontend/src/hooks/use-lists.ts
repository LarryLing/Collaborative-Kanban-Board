import type { Board, List, UseListsReturnType } from "@/lib/types";
import { getAllLists, createList, deleteList, updateList, updateListPosition } from "@/api/lists";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
    onSettled: (_data, _error, variables) => {
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
    onSettled: (_data, _error, variables) => {
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
    onSettled: (_data, _error, variables) => {
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
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
    },
  });

  return {
    lists,
    isLoading,
    createListMutation,
    deleteListMutation,
    updateListMutation,
    updateListPositionMutation,
  };
}
