import type { Board, Card, List } from "@/lib/types";
import { invokeAPI } from "@/lib/utils";

export async function getAllCards({ boardId }: { boardId: Board["id"] }) {
  const response = await invokeAPI(`/api/cards/${boardId}`, "GET");
  const { data } = await response.json();

  return data as Card[];
}

export async function createCard({
  boardId,
  listId,
  cardId,
  cardTitle,
  cardDescription,
  cardPosition,
}: {
  boardId: Board["id"];
  listId: List["id"];
  cardId: Card["id"];
  cardTitle: Card["title"];
  cardDescription: Card["description"];
  cardPosition: Card["id"];
}) {
  await invokeAPI(
    `/api/cards/${boardId}/${listId}`,
    "POST",
    JSON.stringify({
      id: cardId,
      title: cardTitle,
      description: cardDescription,
      position: cardPosition,
    }),
  );
}

export async function deleteCard({
  boardId,
  listId,
  cardId,
}: {
  boardId: Board["id"];
  listId: List["id"];
  cardId: Card["id"];
}) {
  await invokeAPI(`/api/cards/${boardId}/${listId}/${cardId}`, "DELETE");
}

export async function updateCard({
  boardId,
  listId,
  cardId,
  cardTitle,
  cardDescription,
}: {
  boardId: Board["id"];
  listId: List["id"];
  cardId: Card["id"];
  cardTitle: Card["title"];
  cardDescription: Card["description"];
}) {
  await invokeAPI(
    `/api/cards/${boardId}/${listId}/${cardId}`,
    "PATCH",
    JSON.stringify({
      title: cardTitle,
      description: cardDescription,
    }),
  );
}

export async function updateCardPosition({
  boardId,
  listId,
  cardId,
  cardPosition,
  newListId,
}: {
  boardId: Board["id"];
  listId: List["id"];
  cardId: Card["id"];
  cardPosition: Card["position"];
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
