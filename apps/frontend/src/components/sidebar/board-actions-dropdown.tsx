import type { Board } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Share, Trash } from "lucide-react";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import { useUpdateBoard } from "@/hooks/use-update-board";
import { useBoards } from "@/hooks/use-boards";

type BoardActionsDropdownProps = Pick<Board, "id" | "title">;

export function BoardActionsDropdown({ id, title }: BoardActionsDropdownProps) {
  const { isMobile } = useSidebar();

  const { openUpdateBoardDialog } = useUpdateBoard();

  const { deleteBoardMutation } = useBoards();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          showOnHover
          className="data-[state=open]:bg-accent rounded-sm"
        >
          <EllipsisVertical />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem onClick={() => openUpdateBoardDialog(id, title)}>
          <Pencil />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => deleteBoardMutation({ boardId: id })}
        >
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
