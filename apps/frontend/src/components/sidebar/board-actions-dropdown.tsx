import type { Board, UseCollaboratorDialogReturnType, UseUpdateBoardDialogReturnType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Share, Trash } from "lucide-react";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import { useBoards } from "@/hooks/use-boards";

type BoardActionsDropdownProps = Pick<Board, "id" | "title"> & {
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
};

export default function BoardActionsDropdown({
  id,
  title,
  openCollaboratorDialog,
  openUpdateBoardDialog,
}: BoardActionsDropdownProps) {
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
        <SidebarMenuAction showOnHover className="data-[state=open]:bg-accent rounded-sm">
          <EllipsisVertical />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem onClick={handleOpenUpdateBoardDialog}>
          <Pencil />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenCollaboratorDialog}>
          <Share />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDeleteBoardMutation}>
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
