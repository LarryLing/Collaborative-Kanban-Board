import {
  type AddCollaboratorForm,
  type Board,
  type Collaborator,
  type CollaboratorDialogContextType,
} from "@/lib/types";
import { useState, type ReactNode } from "react";
import { CollaboratorDialogContext } from "./collaborator-dialog-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCollaboratorSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCollaborator, removeCollaborator } from "@/api/collaborators";

type CollaboratorDialogProviderProps = {
  children: ReactNode;
};

export function CollaboratorDialogProvider({
  children,
}: CollaboratorDialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"] | null>(null);

  const queryClient = useQueryClient();

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

  async function onSubmit(values: AddCollaboratorForm) {
    if (!boardId) return;

    try {
      await addCollaboratorMutation({ boardId, email: values.email });
      form.reset();
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  }

  const openCollaboratorDialog = (boardId: Board["id"]) => {
    form.reset();
    setBoardId(boardId);
    setOpen(true);
  };

  const contextValue: CollaboratorDialogContextType = {
    open,
    setOpen,
    boardId,
    removeCollaboratorMutation,
    form,
    onSubmit,
    openCollaboratorDialog,
  };

  return (
    <CollaboratorDialogContext.Provider value={contextValue}>
      {children}
    </CollaboratorDialogContext.Provider>
  );
}
