import { Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

import type { Card, UseCardsReturnType, UseUpdateCardDialogReturnType } from "@/lib/types";

import CardActionsDropdown from "./card-actions-dropdown";

type CardButtonProps = Pick<Card, "board_id" | "description" | "id" | "list_id" | "title"> & {
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  index: number;
  openUpdateCardDialog: UseUpdateCardDialogReturnType["openUpdateCardDialog"];
};

export default function CardButton({
  board_id,
  deleteCardMutation,
  description,
  id,
  index,
  list_id,
  openUpdateCardDialog,
  title,
}: CardButtonProps) {
  const handleOpenUpdateCardDialog = () => {
    openUpdateCardDialog(board_id, list_id, id, title, description);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="flex items-center justify-between gap-2 p-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer"
            onClick={handleOpenUpdateCardDialog}
          >
            <div className="flex items-center gap-2">
              <div {...provided.dragHandleProps} className="cursor-grab">
                <GripVertical className="size-4" />
              </div>
              <p className="max-w-[180px] truncate ">{title}</p>
            </div>
            <CardActionsDropdown
              boardId={board_id}
              cardId={id}
              deleteCardMutation={deleteCardMutation}
              listId={list_id}
            />
          </div>
        );
      }}
    </Draggable>
  );
}
