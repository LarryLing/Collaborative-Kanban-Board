import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import type { Board, List, UseCreateCardDialogReturnType } from "@/lib/types";

type CreateCardButtonProps = {
  boardId: Board["id"];
  listId: List["id"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
};

export default function CreateCardButton({
  boardId,
  listId,
  openCreateCardDialog,
}: CreateCardButtonProps) {
  const handleOpenCreateCardDialog = () => {
    openCreateCardDialog(boardId, listId);
  };

  return (
    <Button
      variant="ghost"
      className="w-full"
      size="sm"
      onClick={handleOpenCreateCardDialog}
    >
      <Plus />
      <p className="text-xs">Create Card</p>
    </Button>
  );
}
