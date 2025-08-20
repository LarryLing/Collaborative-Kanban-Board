import type { Board, List } from "@/lib/types";
import { invokeAPI } from "@/lib/utils";

export async function getAllLists({ boardId }: { boardId: Board["id"] }) {
  const response = await invokeAPI(`/api/lists/${boardId}`, "GET");
  const { data } = await response.json();

  return data as List[];
}

export async function createList({
  boardId,
  listId,
  listTitle,
  listPosition,
}: {
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["id"];
  listPosition: List["id"];
}) {
  await invokeAPI(
    `/api/lists/${boardId}`,
    "POST",
    JSON.stringify({
      id: listId,
      title: listTitle.length > 0 ? listTitle : "Untitled List",
      position: listPosition,
    }),
  );
}

export async function deleteList({ boardId, listId }: { boardId: Board["id"]; listId: List["id"] }) {
  await invokeAPI(`/api/lists/${boardId}/${listId}`, "DELETE");
}

export async function updateList({
  boardId,
  listId,
  listTitle,
}: {
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["title"];
}) {
  await invokeAPI(
    `/api/lists/${boardId}/${listId}`,
    "PATCH",
    JSON.stringify({
      title: listTitle.length > 0 ? listTitle : "Untitled List",
    }),
  );
}

export async function updateListPosition({
  boardId,
  listId,
  listPosition,
}: {
  boardId: Board["id"];
  listId: List["id"];
  listPosition: List["position"];
}) {
  await invokeAPI(
    `/api/lists/${boardId}/${listId}/position`,
    "PATCH",
    JSON.stringify({
      position: listPosition,
    }),
  );
}
