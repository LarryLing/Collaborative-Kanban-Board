import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House, RefreshCcw } from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { CreateBoardDialog } from "../boards/create-board-dialog";
import type { UseCollaboratorDialogReturnType, UseUpdateBoardDialogReturnType } from "@/lib/types";
import { memo } from "react";
import { SidebarBoardMenuItemMemo } from "./sidebar-board-menu-item";

export const NavMainMemo = memo(NavMain);

type NavMainProps = {
  openUpdateBoardDialog: UseUpdateBoardDialogReturnType["openUpdateBoardDialog"];
  openCollaboratorDialog: UseCollaboratorDialogReturnType["openCollaboratorDialog"];
};

function NavMain({ openUpdateBoardDialog, openCollaboratorDialog }: NavMainProps) {
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
            <Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline" asChild>
              <Link to="/boards">
                <House />
                <span className="sr-only">Boards</span>
              </Link>
            </Button>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={handleRefetch}
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
                openUpdateBoardDialog={openUpdateBoardDialog}
                openCollaboratorDialog={openCollaboratorDialog}
              />
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
