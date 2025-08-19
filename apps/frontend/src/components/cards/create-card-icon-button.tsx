import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import type { Board, List, UseCreateCardDialogReturnType } from "@/lib/types";

type CreateCardIconButtonProps = {
  boardId: Board["id"];
  listId: List["id"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
};

export default function CreateCardIconButton({
  boardId,
  listId,
  openCreateCardDialog,
}: CreateCardIconButtonProps) {
  const handleOpenCreateCardDialog = () => {
    openCreateCardDialog(boardId, listId);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-5"
      onClick={handleOpenCreateCardDialog}
    >
      <Plus />
      <span className="sr-only">Create Card</span>
    </Button>
  );
}
