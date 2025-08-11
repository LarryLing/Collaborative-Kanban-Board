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
  Folder,
  Plus,
  Share,
  SquareKanban,
  Trash,
} from "lucide-react";
import type { Board } from "@/lib/types";

type NavMainProps = {
  boards: Board[];
};

export function NavMain({ boards }: NavMainProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Plus />
              <span>New Board</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          {boards.map((board) => (
            <SidebarMenuItem key={board.id}>
              <SidebarMenuButton asChild>
                <a href="#">
                  <SquareKanban />
                  <span>{board.title}</span>
                </a>
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
                    <Folder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
