import { useCallback, useState } from "react";
import type {
  AddCollaboratorForm,
  Board,
  UseCollaboratorDialogReturnType,
} from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCollaborator,
  getAllCollaborators,
  removeCollaborator,
} from "@/api/collaborators";
import { AddCollaboratorSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./use-auth";
import { useNavigate } from "@tanstack/react-router";

export function useCollaboratorDialog(): UseCollaboratorDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: collaborators,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["collaborators", { boardId }],
    queryFn: async () => {
      if (!boardId) return [];
      return await getAllCollaborators({ boardId });
    },
  });

  const { mutateAsync: addCollaboratorMutation } = useMutation({
    mutationKey: ["addCollaborator"],
    mutationFn: addCollaborator,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collaborators", { boardId: variables.boardId }],
      });

      setError(null);
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to add collaborator:", error.message);

      setError(error.message);
      form.reset();
    },
  });

  const { mutateAsync: removeCollaboratorMutation } = useMutation({
    mutationKey: ["removeCollaborator"],
    mutationFn: removeCollaborator,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });

      if (user!.id === variables.collaboratorId) {
        setOpen(false);
        navigate({ to: "/boards" });
      }
    },
    onError: (error) => {
      console.error("Failed to remove collaborator:", error.message);

      setError(error.message);
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
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  };

  const openCollaboratorDialog = useCallback(
    async (boardId: Board["id"]) => {
      form.reset();
      setBoardId(boardId);
      setOpen(true);
      await refetch();
    },
    [form, refetch],
  );

  return {
    open,
    setOpen,
    boardId,
    error,
    collaborators,
    isLoading,
    removeCollaboratorMutation,
    form,
    onSubmit,
    openCollaboratorDialog,
  };
}
