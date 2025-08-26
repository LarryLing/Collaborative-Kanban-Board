import { Plus } from "lucide-react";

import type { Board, List, UseCreateCardDialogReturnType } from "@/lib/types";

import { Button } from "../ui/button";

type CreateCardButtonProps = {
  boardId: Board["id"];
  listId: List["id"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
};

export default function CreateCardButton({ boardId, listId, openCreateCardDialog }: CreateCardButtonProps) {
  const handleOpenCreateCardDialog = () => {
    openCreateCardDialog(boardId, listId);
  };

  return (
    <Button className="w-full" onClick={handleOpenCreateCardDialog} size="sm" variant="ghost">
      <Plus />
      <p className="text-xs">Create Card</p>
    </Button>
  );
}
