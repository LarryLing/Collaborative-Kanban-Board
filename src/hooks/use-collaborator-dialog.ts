import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AddCollaboratorForm, Board, UseCollaboratorDialogReturnType } from "@/lib/types";

import { addCollaborator, getAllCollaborators, removeCollaborator } from "@/api/collaborators";
import { AddCollaboratorSchema } from "@/lib/schemas";

import { useAuth } from "./use-auth";

export function useCollaboratorDialog(): UseCollaboratorDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"] | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: collaborators,
    isLoading,
    refetch,
  } = useQuery({
    enabled: !!boardId,
    queryFn: async () => {
      if (!boardId) return [];
      return await getAllCollaborators({ boardId });
    },
    queryKey: ["collaborators", boardId],
  });

  const { mutateAsync: addCollaboratorMutation } = useMutation({
    mutationFn: addCollaborator,
    mutationKey: ["addCollaborator"],
    onError: (error) => {
      toast.error("Failed to add collaborator", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
      form.reset();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collaborators", variables.boardId],
      });

      form.reset();
    },
  });

  const { mutateAsync: removeCollaboratorMutation } = useMutation({
    mutationFn: removeCollaborator,
    mutationKey: ["removeCollaborator"],
    onError: (error) => {
      toast.error("Failed to remove collaborator", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collaborators", variables.boardId],
      });

      if (user!.id === variables.collaboratorId) {
        queryClient.invalidateQueries({
          queryKey: ["boards"],
        });

        setOpen(false);
        navigate({ to: "/boards" });
      }
    },
  });

  const form = useForm<AddCollaboratorForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(AddCollaboratorSchema),
  });

  const onSubmit = async (values: AddCollaboratorForm) => {
    if (!boardId) return;
    await addCollaboratorMutation({ boardId, email: values.email });
  };

  const openCollaboratorDialog = useCallback(
    async (boardId: Board["id"]) => {
      refetch();
      form.reset();
      setBoardId(boardId);
      setOpen(true);
    },
    [form, refetch],
  );

  return {
    boardId,
    collaborators,
    form,
    isLoading,
    onSubmit,
    open,
    openCollaboratorDialog,
    removeCollaboratorMutation,
    setOpen,
  };
}
