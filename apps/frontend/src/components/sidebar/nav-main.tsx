import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House, SquareKanban } from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { CreateBoardDialog } from "../boards/create-board-dialog";
import { BoardActionsDropdown } from "./board-actions-dropdown";

export function NavMain() {
  const { boards, isLoading } = useBoards();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <CreateBoardDialog />
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              asChild
            >
              <Link to="/boards">
                <House />
                <span className="sr-only">Inbox</span>
              </Link>
            </Button>
          </SidebarMenuItem>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          {isLoading ? (
            <SidebarMenuItem>
              <span>Loading boards...</span>
            </SidebarMenuItem>
          ) : (
            boards?.map((board) => (
              <SidebarMenuItem key={board.id}>
                <SidebarMenuButton asChild>
                  <Link
                    to="/boards/$boardId"
                    params={{
                      boardId: board.id,
                    }}
                  >
                    <SquareKanban />
                    <span>{board.title}</span>
                  </Link>
                </SidebarMenuButton>
                <BoardActionsDropdown {...board} />
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
