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

  return {
    boards,
    isLoading,
  };
}
