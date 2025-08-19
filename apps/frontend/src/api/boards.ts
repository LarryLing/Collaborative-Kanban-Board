import type { Board } from "@/lib/types";
import { invokeAPI } from "@/lib/utils";

export async function getAllBoards() {
  const response = await invokeAPI("/api/boards", "GET");
  const { data } = await response.json();

  return data as Board[];
}

export async function createBoard({
  boardId,
  boardTitle,
  boardCreatedAt,
}: {
  boardId: Board["id"];
  boardTitle: Board["title"];
  boardCreatedAt: Board["created_at"];
}) {
  await invokeAPI(
    "/api/boards",
    "POST",
    JSON.stringify({
      id: boardId,
      title: boardTitle,
      created_at: boardCreatedAt,
    }),
  );
}

export async function deleteBoard({ boardId }: { boardId: Board["id"] }) {
  await invokeAPI(`/api/boards/${boardId}`, "DELETE");
}

export async function updateBoard({
  boardId,
  boardTitle,
}: {
  boardId: Board["id"];
  boardTitle: Board["title"];
}) {
  await invokeAPI(
    `/api/boards/${boardId}`,
    "PATCH",
    JSON.stringify({
      title: boardTitle,
    }),
  );
}
