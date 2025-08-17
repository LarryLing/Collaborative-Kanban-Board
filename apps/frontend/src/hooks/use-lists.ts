import type { Board, List, UseListsReturnType } from "@/lib/types";
import {
  getAllLists,
  createList,
  deleteList,
  updateList,
  updateListPosition,
} from "@/api/lists";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export function useLists(boardId: Board["id"]): UseListsReturnType {
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists", { boardId }],
    queryFn: async () => {
      return await getAllLists({ boardId });
    },
  });

  const { mutateAsync: createListMutation } = useMutation({
    mutationKey: ["createList"],
    mutationFn: createList,
    onSuccess: (data, variables) => {
      if (!data) return;

      queryClient.setQueryData(
        ["lists", { boardId: variables.boardId }],
        (prevLists: List[] | undefined) => {
          if (!prevLists) return prevLists;

          return [data, ...prevLists];
        },
      );
    },
    onError: (error) => {
      console.error("Failed to create list:", error.message);
    },
  });

  const { mutateAsync: deleteListMutation } = useMutation({
    mutationKey: ["deleteList"],
    mutationFn: deleteList,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["lists", { boardId: variables.boardId }],
        (prevLists: List[] | undefined) => {
          if (!prevLists) return prevLists;

          return prevLists.filter(
            (prevLists) => prevLists.id !== variables.listId,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Failed to delete list:", error.message);
    },
  });

  const { mutateAsync: updateListMutation } = useMutation({
    mutationKey: ["updateList"],
    mutationFn: updateList,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["lists", { boardId: variables.boardId }],
        (prevLists: List[] | undefined) => {
          if (!prevLists) return prevLists;

          return prevLists.map((prevlist) =>
            prevlist.id === variables.listId
              ? { ...prevlist, title: variables.listTitle }
              : prevlist,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Failed to update list:", error.message);
    },
  });

  const { mutateAsync: updateListPositionMutation } = useMutation({
    mutationKey: ["updateListPosition"],
    mutationFn: updateListPosition,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["lists", { boardId: variables.boardId }],
        (prevLists: List[] | undefined) => {
          if (!prevLists) return prevLists;

          return prevLists.map((prevlist) =>
            prevlist.id === variables.listId
              ? { ...prevlist, position: variables.listPosition }
              : prevlist,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Failed to update list position:", error.message);
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
