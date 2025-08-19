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
      onClick={handleOpenCreateCardDialog}
    >
      <Plus />
      <p>Create Card</p>
    </Button>
  );
}
