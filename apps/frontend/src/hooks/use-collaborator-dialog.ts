import { useCallback, useState } from "react";
import type { AddCollaboratorForm, Board, UseCollaboratorDialogReturnType } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCollaborator, getAllCollaborators, removeCollaborator } from "@/api/collaborators";
import { AddCollaboratorSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./use-auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
    queryKey: ["collaborators", boardId],
    queryFn: async () => {
      if (!boardId) return [];
      return await getAllCollaborators({ boardId });
    },
    enabled: !!boardId,
  });

  const { mutateAsync: addCollaboratorMutation } = useMutation({
    mutationKey: ["addCollaborator"],
    mutationFn: addCollaborator,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collaborators", variables.boardId],
      });

      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to add collaborator", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
      form.reset();
    },
  });

  const { mutateAsync: removeCollaboratorMutation } = useMutation({
    mutationKey: ["removeCollaborator"],
    mutationFn: removeCollaborator,
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
    onError: (error) => {
      toast.error("Failed to remove collaborator", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
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
    open,
    setOpen,
    boardId,
    collaborators,
    isLoading,
    removeCollaboratorMutation,
    form,
    onSubmit,
    openCollaboratorDialog,
  };
}
