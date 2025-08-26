import type { Board, Card, List } from "@/lib/types";

import { invokeAPI } from "@/lib/utils";

export async function createCard({
  boardId,
  cardDescription,
  cardId,
  cardPosition,
  cardTitle,
  listId,
}: {
  boardId: Board["id"];
  cardDescription: Card["description"];
  cardId: Card["id"];
  cardPosition: Card["id"];
  cardTitle: Card["title"];
  listId: List["id"];
}) {
  await invokeAPI(
    `/api/cards/${boardId}/${listId}`,
    "POST",
    JSON.stringify({
      description: cardDescription,
      id: cardId,
      position: cardPosition,
      title: cardTitle,
    }),
  );
}

export async function deleteCard({
  boardId,
  cardId,
  listId,
}: {
  boardId: Board["id"];
  cardId: Card["id"];
  listId: List["id"];
}) {
  await invokeAPI(`/api/cards/${boardId}/${listId}/${cardId}`, "DELETE");
}

export async function getAllCards({ boardId }: { boardId: Board["id"] }) {
  const response = await invokeAPI(`/api/cards/${boardId}`, "GET");
  const { data } = await response.json();

  return data as Card[];
}

export async function updateCard({
  boardId,
  cardDescription,
  cardId,
  cardTitle,
  listId,
}: {
  boardId: Board["id"];
  cardDescription: Card["description"];
  cardId: Card["id"];
  cardTitle: Card["title"];
  listId: List["id"];
}) {
  await invokeAPI(
    `/api/cards/${boardId}/${listId}/${cardId}`,
    "PATCH",
    JSON.stringify({
      description: cardDescription,
      title: cardTitle,
    }),
  );
}

export async function updateCardPosition({
  boardId,
  cardId,
  cardPosition,
  listId,
  newListId,
}: {
  boardId: Board["id"];
  cardId: Card["id"];
  cardPosition: Card["position"];
  listId: List["id"];
  newListId: List["id"];
}) {
  await invokeAPI(
    `/api/cards/${boardId}/${listId}/${cardId}/position`,
    "PATCH",
    JSON.stringify({
      newListId,
      position: cardPosition,
    }),
  );
}
