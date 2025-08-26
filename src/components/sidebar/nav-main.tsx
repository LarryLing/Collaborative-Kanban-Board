import { Link } from "@tanstack/react-router";
import { House, RefreshCcw } from "lucide-react";
import { memo } from "react";

import type { UseCollaboratorDialogReturnType, UseUpdateBoardDialogReturnType } from "@/lib/types";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useBoards } from "@/hooks/use-boards";

import { CreateBoardDialog } from "../boards/create-board-dialog";
import { Button } from "../ui/button";
import { SidebarBoardMenuItemMemo } from "./sidebar-board-menu-item";

export const NavMainMemo = memo(NavMain);

type NavMainProps = {
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
};

function NavMain({ openCollaboratorDialog, openUpdateBoardDialog }: NavMainProps) {
  const { boards, isLoading, refetch } = useBoards();

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <CreateBoardDialog />
            <Button asChild className="size-8 group-data-[collapsible=icon]:opacity-0" size="icon" variant="outline">
              <Link to="/boards">
                <House />
                <span className="sr-only">Boards</span>
              </Link>
            </Button>
            <Button
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              onClick={handleRefetch}
              size="icon"
              variant="outline"
            >
              <RefreshCcw />
              <span className="sr-only">Refresh</span>
            </Button>
          </SidebarMenuItem>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          {isLoading ? (
            <SidebarMenuItem>
              <span>Loading boards...</span>
            </SidebarMenuItem>
          ) : (
            boards?.map((board) => (
              <SidebarBoardMenuItemMemo
                key={board.id}
                {...board}
                openCollaboratorDialog={openCollaboratorDialog}
                openUpdateBoardDialog={openUpdateBoardDialog}
              />
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
