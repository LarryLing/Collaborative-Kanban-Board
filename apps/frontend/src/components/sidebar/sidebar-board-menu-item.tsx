import { Link } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import BoardActionsDropdown from "./board-actions-dropdown";
import type {
  Board,
  UseCollaboratorDialogReturnType,
  UseUpdateBoardDialogReturnType,
} from "@/lib/types";
import { SquareKanban } from "lucide-react";
import { memo } from "react";

export const SidebarBoardMenuItemMemo = memo(SidebarBoardMenuItem);

type SidebarBoardMenuItemProps = Pick<Board, "id" | "title"> & {
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
};

function SidebarBoardMenuItem({
  id,
  title,
  openUpdateBoardDialog,
  openCollaboratorDialog,
}: SidebarBoardMenuItemProps) {
  return (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton asChild>
        <Link
          to="/boards/$boardId"
          params={{
            boardId: id,
          }}
        >
          <SquareKanban />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
      <BoardActionsDropdown
        id={id}
        title={title}
        openUpdateBoardDialog={openUpdateBoardDialog}
        openCollaboratorDialog={openCollaboratorDialog}
      />
    </SidebarMenuItem>
  );
}
