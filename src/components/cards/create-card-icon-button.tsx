import { Plus } from "lucide-react";

import type { Board, List, UseCreateCardDialogReturnType } from "@/lib/types";

import { Button } from "../ui/button";

type CreateCardIconButtonProps = {
  boardId: Board["id"];
  listId: List["id"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
};

export default function CreateCardIconButton({ boardId, listId, openCreateCardDialog }: CreateCardIconButtonProps) {
  const handleOpenCreateCardDialog = () => {
    openCreateCardDialog(boardId, listId);
  };

  return (
    <Button className="size-5" onClick={handleOpenCreateCardDialog} size="icon" variant="ghost">
      <Plus />
      <span className="sr-only">Create Card</span>
    </Button>
  );
}
