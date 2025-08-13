import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  House,
  Pencil,
  Share,
  SquareKanban,
  Trash,
} from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { CreateBoardDialog } from "../boards/create-board-dialog";
import { useUpdateBoard } from "@/hooks/use-update-board";

export function NavMain() {
  const { boards, isLoading, deleteBoardMutation } = useBoards();

  const { openUpdateBoardDialog } = useUpdateBoard();

  const { isMobile } = useSidebar();

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
                    <DropdownMenuItem
                      onClick={() =>
                        openUpdateBoardDialog(board.id, board.title)
                      }
                    >
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
                      onClick={() => deleteBoardMutation({ boardId: board.id })}
                    >
                      <Trash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
