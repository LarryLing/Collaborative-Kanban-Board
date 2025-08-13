import type { Board } from "@/lib/types";
import { buildUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { loadUser } = useAuth();

  useEffect(() => {
    async function fetchBoards() {
      try {
        const accessToken: string | null = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("Failed to load boards: Access token not found");

          await loadUser();

          return;
        }

        const response = await fetch(buildUrl("/api/boards"), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        const { data } = await response.json();

        setBoards(data as Board[]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        console.error("Failed to load boards:", errorMessage);

        setBoards([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoards();
  }, [loadUser]);

  const createBoard = async (boardTitle: Board["title"]) => {
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Failed to create board: Access token not found");

      await loadUser();

      return;
    }

    const response = await fetch(buildUrl("/api/boards"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: boardTitle }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    const { data } = await response.json();

    setBoards((prevBoards) => {
      return [data as Board, ...prevBoards];
    });

    return (data as Board).id;
  };

  const deleteBoard = async (boardId: Board["id"]) => {
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Failed to delete board: Access token not found");

      await loadUser();

      return;
    }

    const response = await fetch(buildUrl(`/api/boards/${boardId}`), {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    setBoards((prevBoards) => {
      return prevBoards.filter((prevBoard) => prevBoard.id !== boardId);
    });
  };

  return {
    boards,
    isLoading,
    createBoard,
    deleteBoard,
  };
}
