import type { Board } from "@/lib/types";
import { buildUrl } from "@/lib/utils";

export const getAllBoards = async (): Promise<Board[]> => {
  const accessToken: string | null = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Failed to load boards: Access token not found");
    return [];
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

  return data as Board[];
};

export const createBoard = async ({
  boardTitle,
}: {
  boardTitle: Board["title"];
}): Promise<Board | undefined> => {
  const accessToken: string | null = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Failed to create board: Access token not found");
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

  return data as Board;
};

export const deleteBoard = async ({
  boardId,
}: {
  boardId: Board["id"];
}): Promise<void> => {
  const accessToken: string | null = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Failed to delete board: Access token not found");
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
};

export const updateBoard = async ({
  boardId,
  boardTitle,
}: {
  boardId: Board["id"];
  boardTitle: Board["title"];
}): Promise<void> => {
  try {
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Failed to update board: Access token not found");
      return;
    }

    const response = await fetch(buildUrl(`/api/boards/${boardId}`), {
      method: "PATCH",
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to update board:", errorMessage);
  }
};
