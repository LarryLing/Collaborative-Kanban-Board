import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import type { Board, UpdateBoardForm, UseUpdateBoardDialogReturnType } from "@/lib/types";

import { useBoards } from "@/hooks/use-boards";
import { UpdateBoardSchema } from "@/lib/schemas";

export function useUpdateBoardDialog(): UseUpdateBoardDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");

  const { updateBoardMutation } = useBoards();

  const form = useForm<UpdateBoardForm>({
    defaultValues: {
      boardTitle: "",
    },
    resolver: zodResolver(UpdateBoardSchema),
  });

  const onSubmit = async (values: UpdateBoardForm) => {
    await updateBoardMutation({
      boardId,
      boardTitle: values.boardTitle.length > 0 ? values.boardTitle : "Untitled Board",
    });

    setOpen(false);
  };

  const openUpdateBoardDialog = useCallback(
    (boardId: Board["id"], boardTitle: Board["title"]) => {
      form.reset({
        boardTitle,
      });
      setOpen(true);
      setBoardId(boardId);
    },
    [form],
  );

  return {
    form,
    onSubmit,
    open,
    openUpdateBoardDialog,
    setOpen,
  };
}
