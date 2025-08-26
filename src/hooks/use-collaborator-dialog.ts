import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AddCollaboratorForm, Board, Collaborator, UseCollaboratorDialogReturnType } from "@/lib/types";

import { addCollaborator, getAllCollaborators, removeCollaborator } from "@/api/collaborators";
import { AddCollaboratorSchema } from "@/lib/schemas";

import { useAuth } from "./use-auth";
import { events } from "aws-amplify/api";
import { EVENT_TYPE_ADD_COLLABORATOR, EVENT_TYPE_REMOVE_COLLABORATOR } from "@/lib/constants";

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
      try {
        return await getAllCollaborators({ boardId });
      } catch (error) {
        if (error instanceof Error && error.message === "User is not a board collaborator") {
          navigate({ to: "/boards" });
        }
      }
    },
    queryKey: ["collaborators", boardId],
  });

  useEffect(() => {
    const channel = events.connect(`/default/collaborators/${boardId}`);
    channel.then((ch) => {
      ch.subscribe({
        next: (data) => {
          console.log(data);
          if (data.type === EVENT_TYPE_ADD_COLLABORATOR) {
            const prevCollaborators: Collaborator[] | undefined = queryClient.getQueryData(["collaborators", boardId]);

            if (!prevCollaborators) return prevCollaborators;

            const nextCollaborators = [...prevCollaborators, data.new as Collaborator];

            queryClient.setQueryData(["collaborators", boardId], nextCollaborators);
          } else if (data.type === EVENT_TYPE_REMOVE_COLLABORATOR) {
            const prevCollaborators: Collaborator[] | undefined = queryClient.getQueryData(["collaborators", boardId]);

            if (!prevCollaborators) return prevCollaborators;

            const { id } = data.old as Pick<Collaborator, "id">;

            if (user!.id === id) {
              queryClient.invalidateQueries({
                queryKey: ["boards"],
              });

              navigate({ to: "/boards" });
              setOpen(false);
              return;
            }

            const nextCollaborators = prevCollaborators.filter((prevCollaborator) => prevCollaborator.id !== id);

            queryClient.setQueryData(["collaborators", boardId], nextCollaborators);
          }

          queryClient.invalidateQueries({
            queryKey: ["collaborators", boardId],
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
    });

    return () => {
      channel?.then((ch) => ch?.close());
    };
  }, [boardId, queryClient, user]);

  const { mutateAsync: addCollaboratorMutation } = useMutation({
    mutationFn: addCollaborator,
    mutationKey: ["addCollaborator"],
    onError: (error) => {
      toast.error("Failed to add collaborator", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }

      form.reset();
    },
    onSuccess: async (data, variables) => {
      await events.post(`/default/collaborators/${variables.boardId}`, {
        new: data,
        type: EVENT_TYPE_ADD_COLLABORATOR,
      });

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

      if (error.message === "User is not a board collaborator") {
        navigate({ to: "/boards" });
      }
    },
    onSuccess: async (_data, variables) => {
      await events.post(`/default/collaborators/${variables.boardId}`, {
        old: {
          id: variables.collaboratorId,
        },
        type: EVENT_TYPE_REMOVE_COLLABORATOR,
      });

      if (user!.id === variables.collaboratorId) {
        queryClient.invalidateQueries({
          queryKey: ["boards"],
        });

        navigate({ to: "/boards" });
        setOpen(false);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["collaborators", variables.boardId],
      });
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
