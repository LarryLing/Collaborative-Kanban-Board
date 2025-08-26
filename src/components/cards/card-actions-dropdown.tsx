import { Ellipsis, Trash } from "lucide-react";

import type { Board, Card, List, UseCardsReturnType } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

type CardActionsDropdownProps = {
  boardId: Board["id"];
  cardId: Card["id"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  listId: List["id"];
};

export default function CardActionsDropdown({ boardId, cardId, deleteCardMutation, listId }: CardActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-5" size="icon" variant="ghost">
          <Ellipsis />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 rounded-lg">
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            await deleteCardMutation({ boardId, cardId, listId });
          }}
          variant="destructive"
        >
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
