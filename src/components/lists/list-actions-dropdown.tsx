import { Ellipsis, Trash } from "lucide-react";

import type { Board, List, UseListsReturnType } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

type ListActionsDropdownProps = {
  boardId: Board["id"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
  listId: List["id"];
};

export default function ListActionsDropdown({ boardId, deleteListMutation, listId }: ListActionsDropdownProps) {
  const handleDeleteListMutation = async () => {
    await deleteListMutation({ boardId, listId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-5" size="icon" variant="ghost">
          <Ellipsis />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 rounded-lg">
        <DropdownMenuItem onClick={handleDeleteListMutation} variant="destructive">
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
