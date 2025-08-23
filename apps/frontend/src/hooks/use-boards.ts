import type { Board, UseBoardsReturnType } from "@/lib/types";
import { getAllBoards, createBoard, deleteBoard, updateBoard } from "@/api/boards";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
    queryKey: ["boards"],
    queryFn: getAllBoards,
  });

  const { mutateAsync: createBoardMutation } = useMutation({
    mutationKey: ["createBoard"],
    mutationFn: createBoard,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      const prevBoards: Board[] | undefined = queryClient.getQueryData(["boards"]);

      if (!prevBoards) return prevBoards;

      const newBoard: Board = {
        id: variables.boardId,
        owner_id: user!.id,
        title: variables.boardTitle,
        created_at: variables.boardCreatedAt,
      };

      const nextBoards = [newBoard, ...prevBoards];

      queryClient.setQueryData(["board"], nextBoards);

      return { prevBoards };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to create board:", error.message);

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });

      navigate({
        to: "/boards/$boardId",
        params: { boardId: variables.boardId },
      });
    },
  });

  //TODO: refetch boards and relavent content after deleting a board. query keys need to be restructured
  const { mutateAsync: deleteBoardMutation } = useMutation({
    mutationKey: ["deleteBoard"],
    mutationFn: deleteBoard,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      const prevBoards: Board[] | undefined = queryClient.getQueryData(["boards"]);

      if (!prevBoards) return prevBoards;

      const nextBoards = prevBoards.filter((prevBoards) => prevBoards.id !== variables.boardId);

      queryClient.setQueryData(["board"], nextBoards);

      return { prevBoards };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to delete board:", error.message);

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });

      navigate({ to: "/boards" });
    },
  });

  const { mutateAsync: updateBoardMutation } = useMutation({
    mutationKey: ["updateBoard"],
    mutationFn: updateBoard,
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
    onError: (error, _variables, context) => {
      console.error("Failed to update board:", error.message);

      queryClient.setQueryData(["boards"], context?.prevBoards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });

  return {
    boards,
    isLoading,
    refetch,
    createBoardMutation,
    deleteBoardMutation,
    updateBoardMutation,
  };
}
