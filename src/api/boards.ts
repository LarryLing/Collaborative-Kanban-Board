import type { Board } from "@/lib/types";

import { invokeAPI } from "@/lib/utils";

export async function createBoard({
  boardCreatedAt,
  boardId,
  boardTitle,
}: {
  boardCreatedAt: Board["created_at"];
  boardId: Board["id"];
  boardTitle: Board["title"];
}) {
  await invokeAPI(
    "/api/boards",
    "POST",
    JSON.stringify({
      created_at: boardCreatedAt,
      id: boardId,
      title: boardTitle,
    }),
  );
}

export async function deleteBoard({ boardId }: { boardId: Board["id"] }) {
  await invokeAPI(`/api/boards/${boardId}`, "DELETE");
}

export async function getAllBoards() {
  const response = await invokeAPI("/api/boards", "GET");
  const { data } = await response.json();

  return data as Board[];
}

export async function getBoardById({ boardId }: { boardId: Board["id"] }) {
  const response = await invokeAPI(`/api/boards/${boardId}`, "GET");
  const { data } = await response.json();

  return data as Board;
}

export async function updateBoard({ boardId, boardTitle }: { boardId: Board["id"]; boardTitle: Board["title"] }) {
  await invokeAPI(
    `/api/boards/${boardId}`,
    "PATCH",
    JSON.stringify({
      title: boardTitle,
    }),
  );
}
