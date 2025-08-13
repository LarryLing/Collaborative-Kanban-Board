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
  Plus,
  Share,
  SquareKanban,
  Trash,
} from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { Link, useNavigate } from "@tanstack/react-router";

export function NavMain() {
  const { boards, isLoading, createBoard, deleteBoard } = useBoards();

  const { isMobile } = useSidebar();

  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    try {
      const newBoardId = await createBoard("Example board");

      if (newBoardId) {
        navigate({ to: "/boards/$boardId", params: { boardId: newBoardId } });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to create board:", errorMessage);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      navigate({ to: "/boards" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Failed to delete board:", errorMessage);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={handleCreateBoard}
            >
              <Plus />
              <span>New Board</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          {isLoading ? (
            <SidebarMenuItem>
              <span>Loading boards...</span>
            </SidebarMenuItem>
          ) : (
            boards.map((board) => (
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
                    <DropdownMenuItem>
                      <Share />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDeleteBoard(board.id)}
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
