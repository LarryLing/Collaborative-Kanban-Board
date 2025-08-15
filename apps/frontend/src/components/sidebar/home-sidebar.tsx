import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Album } from "lucide-react";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "@tanstack/react-router";
import { UpdateBoardDialog } from "../boards/update-board-dialog";
import { CollaboratorDialog } from "../boards/collaborators-dialog";

type HomeSidebarProps = React.ComponentProps<typeof Sidebar>;

export function HomeSidebar({ ...props }: HomeSidebarProps) {
  const { user } = useAuth();

  if (!user) {
    throw redirect({ to: "/login" });
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Album className="!size-5" />
            <span className="text-base font-semibold">{`Hello ${user.given_name}!`}</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <UpdateBoardDialog />
        <CollaboratorDialog />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
