import type { Board, UpdateBoardForm, UseUpdateBoardDialogReturnType } from "@/lib/types";
import { useCallback, useState } from "react";
import { UpdateBoardSchema } from "@/lib/schemas";
import { useBoards } from "@/hooks/use-boards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useUpdateBoardDialog(): UseUpdateBoardDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");

  const { updateBoardMutation } = useBoards();

  const form = useForm<UpdateBoardForm>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      boardTitle: "",
    },
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
    open,
    setOpen,
    form,
    onSubmit,
    openUpdateBoardDialog,
  };
}
