import { EllipsisVertical, Pencil, Share, Trash } from "lucide-react";

import type { Board, UseCollaboratorDialogReturnType, UseUpdateBoardDialogReturnType } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoards } from "@/hooks/use-boards";

import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

type BoardActionsDropdownProps = Pick<Board, "id" | "owner_id" | "title"> & {
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
};

export default function BoardActionsDropdown({
  id,
  owner_id,
  openCollaboratorDialog,
  openUpdateBoardDialog,
  title,
}: BoardActionsDropdownProps) {
  const { user } = useAuth();

  const { isMobile } = useSidebar();

  const { deleteBoardMutation } = useBoards();

  const handleOpenUpdateBoardDialog = () => {
    openUpdateBoardDialog(id, title);
  };

  const handleOpenCollaboratorDialog = () => {
    openCollaboratorDialog(id);
  };

  const handleDeleteBoardMutation = () => {
    deleteBoardMutation({ boardId: id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm" showOnHover>
          <EllipsisVertical />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "end" : "start"}
        className="w-24 rounded-lg"
        side={isMobile ? "bottom" : "right"}
      >
        <DropdownMenuItem onClick={handleOpenUpdateBoardDialog}>
          <Pencil />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenCollaboratorDialog}>
          <Share />
          <span>Share</span>
        </DropdownMenuItem>
        {owner_id === user!.id && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteBoardMutation} variant="destructive">
              <Trash />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
