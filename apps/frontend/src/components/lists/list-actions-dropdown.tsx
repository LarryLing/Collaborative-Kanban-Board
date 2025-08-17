import type { Board, List, UseListsReturnType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";

type ListActionsDropdownProps = {
  boardId: Board["id"];
  listId: List["id"];
  setOpen: (open: boolean) => void;
  deleteListMutation: UseListsReturnType["deleteListMutation"];
};

export default function ListActionsDropdown({
  boardId,
  listId,
  setOpen,
  deleteListMutation,
}: ListActionsDropdownProps) {
  const handleDeleteListMutation = async () => {
    try {
      await deleteListMutation({ boardId, listId });
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
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Pencil />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
