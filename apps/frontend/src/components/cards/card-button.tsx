import type { Board, Card, List, UseCardsReturnType } from "@/lib/types";
import { GripVertical } from "lucide-react";
import CardActionsDropdown from "./card-actions-dropdown";

type CardButtonProps = Card & {
  boardId: Board["id"];
  listId: List["id"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
};

export default function CardButton({
  id,
  title,
  boardId,
  listId,
  deleteCardMutation,
}: CardButtonProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="cursor-grab">
          <GripVertical className="size-4" />
        </div>
        <p className="max-w-[180px] truncate">{title}</p>
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
