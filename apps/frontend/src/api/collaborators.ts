import type { Board, Collaborator, User } from "@/lib/types";
import { invokeAPI } from "@/lib/utils";

export async function getAllCollaborators({
  boardId,
}: {
  boardId: Board["id"];
}) {
  const response = await invokeAPI(`/api/collaborators/${boardId}`, "GET");
  const { data } = await response.json();

  return data as Collaborator[];
}

export async function addCollaborator({
  boardId,
  email,
}: {
  boardId: Board["id"];
  email: User["email"];
}) {
  const response = await invokeAPI(
    `/api/collaborators/${boardId}`,
    "POST",
    JSON.stringify({ email }),
  );
  const { data } = await response.json();

  return data as Collaborator;
}

export async function removeCollaborator({
  boardId,
  collaboratorId,
}: {
  boardId: Board["id"];
  collaboratorId: Collaborator["id"];
}) {
  await invokeAPI(`/api/collaborators/${boardId}/${collaboratorId}`, "DELETE");
}
