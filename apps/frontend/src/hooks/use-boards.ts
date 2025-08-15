import type { Board, UseBoardsReturnType } from "@/lib/types";
import {
  getAllBoards,
  createBoard,
  deleteBoard,
  updateBoard,
} from "@/api/boards";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useBoards(): UseBoardsReturnType {
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
    onSuccess: (data) => {
      if (!data) return;

      queryClient.setQueryData(
        ["boards"],
        (prevBoards: Board[] | undefined) => {
          if (!prevBoards) return prevBoards;

          return [data, ...prevBoards];
        },
      );

      navigate({ to: "/boards/$boardId", params: { boardId: data.id } });
    },
    onError: (error) => {
      console.error("Failed to create board:", error.message);
    },
  });

  const { mutateAsync: deleteBoardMutation } = useMutation({
    mutationKey: ["deleteBoard"],
    mutationFn: deleteBoard,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["boards"],
        (prevBoards: Board[] | undefined) => {
          if (!prevBoards) return prevBoards;

          return prevBoards.filter(
            (prevBoards) => prevBoards.id !== variables.boardId,
          );
        },
      );

      navigate({ to: "/boards" });
    },
    onError: (error) => {
      console.error("Failed to delete board:", error.message);
    },
  });

  const { mutateAsync: updateBoardMutation } = useMutation({
    mutationKey: ["updateBoard"],
    mutationFn: updateBoard,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["boards"],
        (prevBoards: Board[] | undefined) => {
          if (!prevBoards) return prevBoards;

          return prevBoards.map((prevBoard) =>
            prevBoard.id === variables.boardId
              ? { ...prevBoard, title: variables.boardTitle }
              : prevBoard,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Failed to update board:", error.message);
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
