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
import type { Board, User } from "@/lib/types";
import { NavMain } from "./nav-main";

type HomeSidebarProps = {
  user: User;
  boards: Board[];
} & React.ComponentProps<typeof Sidebar>;

export function HomeSidebar({ user, boards, ...props }: HomeSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Album className="!size-5" />
            <span className="text-base font-semibold">{`Hello ${user.givenName}!`}</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain boards={boards} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
