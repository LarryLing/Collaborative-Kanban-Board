import type {
  Board,
  Card,
  List,
  UseCardsReturnType,
  UseUpdateCardDialogReturnType,
} from "@/lib/types";
import { GripVertical } from "lucide-react";
import CardActionsDropdown from "./card-actions-dropdown";
import { CARD } from "@/lib/constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CardButtonProps = Pick<
  Card,
  "id" | "title" | "description" | "position"
> & {
  boardId: Board["id"];
  listId: List["id"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  openUpdateCardDialog: UseUpdateCardDialogReturnType["openUpdateCardDialog"];
};

export default function CardButton({
  id,
  title,
  description,
  position,
  boardId,
  listId,
  deleteCardMutation,
  openUpdateCardDialog,
}: CardButtonProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        type: CARD,
        card: {
          id,
          board_id: boardId,
          list_id: listId,
          title,
          description,
          position,
        },
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleOpenUpdateCardDialog = () => {
    openUpdateCardDialog(boardId, listId, id, title, description);
  };

  return (
    <div
      className="flex items-center justify-between gap-2 p-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer"
      style={style}
      onClick={handleOpenUpdateCardDialog}
    >
      <div className="flex items-center gap-2">
        <div ref={setNodeRef} {...attributes} {...listeners}>
          <GripVertical className="size-4" />
        </div>
        <p className="max-w-[180px] truncate ">{title}</p>
      </div>
      <CardActionsDropdown
        boardId={boardId}
        listId={listId}
        cardId={id}
        deleteCardMutation={deleteCardMutation}
      />
    </div>
  );
}
