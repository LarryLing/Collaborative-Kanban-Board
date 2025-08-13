import type { Board } from "@/lib/types";
import { buildUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { loadUser } = useAuth();

  useEffect(() => {
    async function fetchBoard() {
      try {
        const accessToken: string | null = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("Failed to load boards: Access token not found");

          await loadUser();

          return;
        }

        const response = await fetch(buildUrl(`/api/boards/${boardId}`), {
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

        setBoard(data as Board);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        console.error("Failed to load boards:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoard();
  }, [boardId, loadUser]);

  return { board, isLoading };
}
