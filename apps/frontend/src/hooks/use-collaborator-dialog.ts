import { useCallback, useState } from "react";
import type {
  AddCollaboratorForm,
  Board,
  Collaborator,
  UseCollaboratorDialogReturnType,
} from "@/lib/types";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  addCollaborator,
  getAllCollaborators,
  removeCollaborator,
} from "@/api/collaborators";
import { AddCollaboratorSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useCollaboratorDialog(): UseCollaboratorDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"] | null>(null);

  const queryClient = useQueryClient();

  const { data: collaborators } = useSuspenseQuery({
    queryKey: ["collaborators", { boardId }],
    queryFn: async () => {
      if (!boardId) return [];
      return await getAllCollaborators({ boardId });
    },
  });

  const { mutateAsync: addCollaboratorMutation } = useMutation({
    mutationKey: ["addCollaborator"],
    mutationFn: addCollaborator,
    onSuccess: (data) => {
      if (!data) return;

      queryClient.setQueryData(
        ["collaborators", { boardId }],
        (prevCollaborators: Collaborator[] | undefined) => {
          if (!prevCollaborators) return prevCollaborators;

          return [data, ...prevCollaborators];
        },
      );
    },
    onError: (error) => {
      console.error("Failed to add collaborator:", error.message);
    },
  });

  const { mutateAsync: removeCollaboratorMutation } = useMutation({
    mutationKey: ["removeCollaborator"],
    mutationFn: removeCollaborator,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["collaborators", { boardId }],
        (prevCollaborators: Collaborator[] | undefined) => {
          if (!prevCollaborators) return prevCollaborators;

          return prevCollaborators.filter(
            (prevCollaborators) =>
              prevCollaborators.id !== variables.collaboratorId,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Failed to remove collaborator:", error.message);
    },
  });

  const form = useForm<AddCollaboratorForm>({
    resolver: zodResolver(AddCollaboratorSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: AddCollaboratorForm) => {
    if (!boardId) return;

    try {
      await addCollaboratorMutation({ boardId, email: values.email });
      form.reset();
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  };

  const openCollaboratorDialog = useCallback(
    (boardId: Board["id"]) => {
      form.reset();
      setBoardId(boardId);
      setOpen(true);
    },
    [form],
  );

  return {
    open,
    setOpen,
    boardId,
    collaborators,
    removeCollaboratorMutation,
    form,
    onSubmit,
    openCollaboratorDialog,
  };
}
