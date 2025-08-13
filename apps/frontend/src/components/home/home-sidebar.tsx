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
import { Link, redirect } from "@tanstack/react-router";

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
          <Link to="/boards">
            <SidebarMenuItem className="flex items-center gap-2">
              <Album className="!size-5" />
              <span className="text-base font-semibold">{`Hello ${user.givenName}!`}</span>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
