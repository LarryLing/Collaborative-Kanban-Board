import type { Board, Card, List, UseCardsReturnType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash } from "lucide-react";
import { Button } from "../ui/button";

type CardActionsDropdownProps = {
  boardId: Board["id"];
  listId: List["id"];
  cardId: Card["id"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
};

export default function CardActionsDropdown({
  boardId,
  listId,
  cardId,
  deleteCardMutation,
}: CardActionsDropdownProps) {
  const handleDeleteCardMutation = async () => {
    try {
      await deleteCardMutation({ boardId, listId, cardId });
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-5">
          <Ellipsis />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 rounded-lg">
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDeleteCardMutation}
        >
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
