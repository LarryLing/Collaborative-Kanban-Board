import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import type { Board, UseBoardsReturnType } from "@/lib/types";

import { createBoard, deleteBoard, getAllBoards, updateBoard } from "@/api/boards";

import { useAuth } from "./use-auth";

export function useBoards(): UseBoardsReturnType {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: boards,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: getAllBoards,
    queryKey: ["boards"],
  });

  const { mutateAsync: createBoardMutation } = useMutation({
    mutationFn: createBoard,
    mutationKey: ["createBoard"],
    onError: (error, _variables, context: { prevBoards: Board[] } | undefined) => {
      toast.error("Failed to create board", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      const prevBoards: Board[] | undefined = queryClient.getQueryData(["boards"]);

      if (!prevBoards) return prevBoards;

      const newBoard: Board = {
        created_at: variables.boardCreatedAt,
        id: variables.boardId,
        owner_id: user!.id,
        title: variables.boardTitle,
      };

      const nextBoards = [newBoard, ...prevBoards];

      queryClient.setQueryData(["boards"], nextBoards);

      return { prevBoards };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });

      navigate({
        params: { boardId: variables.boardId },
        to: "/boards/$boardId",
      });
    },
  });

  const { mutateAsync: deleteBoardMutation } = useMutation({
    mutationFn: deleteBoard,
    mutationKey: ["deleteBoard"],
    onError: (error, _variables, context: { prevBoards: Board[] } | undefined) => {
      toast.error("Failed to delete board", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      const prevBoards: Board[] | undefined = queryClient.getQueryData(["boards"]);

      if (!prevBoards) return prevBoards;

      const nextBoards = prevBoards.filter((prevBoards) => prevBoards.id !== variables.boardId);

      queryClient.setQueryData(["boards"], nextBoards);

      return { prevBoards };
    },
    onSettled: (_data, _error, _variables) => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });

      navigate({ to: "/boards" });
    },
  });

  const { mutateAsync: updateBoardMutation } = useMutation({
    mutationFn: updateBoard,
    mutationKey: ["updateBoard"],
    onError: (error, _variables, context: { prevBoards: Board[] } | undefined) => {
      toast.error("Failed to update board", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      const prevBoards: Board[] | undefined = queryClient.getQueryData(["boards"]);

      if (!prevBoards) return prevBoards;

      const nextBoards = prevBoards.map((prevBoard) =>
        prevBoard.id === variables.boardId ? { ...prevBoard, title: variables.boardTitle } : prevBoard,
      );

      queryClient.setQueryData(["boards"], nextBoards);

      return { prevBoards };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });

  return {
    boards,
    createBoardMutation,
    deleteBoardMutation,
    isLoading,
    refetch,
    updateBoardMutation,
  };
}
