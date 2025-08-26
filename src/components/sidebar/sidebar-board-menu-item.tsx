import { Link } from "@tanstack/react-router";
import { SquareKanban } from "lucide-react";
import { memo } from "react";

import type { Board, UseCollaboratorDialogReturnType, UseUpdateBoardDialogReturnType } from "@/lib/types";

import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import BoardActionsDropdown from "./board-actions-dropdown";

export const SidebarBoardMenuItemMemo = memo(SidebarBoardMenuItem);

type SidebarBoardMenuItemProps = Pick<Board, "id" | "owner_id" | "title"> & {
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
};

function SidebarBoardMenuItem({ id, owner_id, openCollaboratorDialog, openUpdateBoardDialog, title }: SidebarBoardMenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          params={{
            boardId: id,
          }}
          to="/boards/$boardId"
        >
          <SquareKanban />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
      <BoardActionsDropdown
        id={id}
        owner_id={owner_id}
        openCollaboratorDialog={openCollaboratorDialog}
        openUpdateBoardDialog={openUpdateBoardDialog}
        title={title}
      />
    </SidebarMenuItem>
  );
}
