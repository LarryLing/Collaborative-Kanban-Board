import type { Board, List, UseListsReturnType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash } from "lucide-react";
import { Button } from "../ui/button";

type ListActionsDropdownProps = {
  boardId: Board["id"];
  listId: List["id"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
};

export default function ListActionsDropdown({
  boardId,
  listId,
  deleteListMutation,
}: ListActionsDropdownProps) {
  const handleDeleteListMutation = async () => {
    await deleteListMutation({ boardId, listId });
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
          onClick={handleDeleteListMutation}
        >
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
