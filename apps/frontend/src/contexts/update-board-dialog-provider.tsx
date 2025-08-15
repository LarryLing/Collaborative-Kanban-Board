import type {
  Board,
  UpdateBoardDialogContextType,
  UpdateBoardForm,
} from "@/lib/types";
import { useState, type ReactNode } from "react";
import { UpdateBoardSchema } from "@/lib/schemas";
import { useBoards } from "@/hooks/use-boards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBoardDialogContext } from "./update-board-dialog-context";

type UpdateBoardDialogProviderProps = {
  children: ReactNode;
};

export function UpdateBoardDialogProvider({
  children,
}: UpdateBoardDialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");

  const { updateBoardMutation } = useBoards();

  const form = useForm<UpdateBoardForm>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      boardTitle: "",
    },
  });

  async function onSubmit(values: UpdateBoardForm) {
    try {
      await updateBoardMutation({ boardId, boardTitle: values.boardTitle });
      setOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }

  const openUpdateBoardDialog = (
    boardId: Board["id"],
    boardTitle: Board["title"],
  ) => {
    form.reset({
      boardTitle,
    });
    setOpen(true);
    setBoardId(boardId);
  };

  const contextValue: UpdateBoardDialogContextType = {
    open,
    setOpen,
    form,
    onSubmit,
    openUpdateBoardDialog,
  };

  return (
    <UpdateBoardDialogContext.Provider value={contextValue}>
      {children}
    </UpdateBoardDialogContext.Provider>
  );
}
