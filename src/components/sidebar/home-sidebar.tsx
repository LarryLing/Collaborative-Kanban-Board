import { redirect } from "@tanstack/react-router";
import { Album } from "lucide-react";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useCollaboratorDialog } from "@/hooks/use-collaborator-dialog";
import { useUpdateBoardDialog } from "@/hooks/use-update-board-dialog";

import { UpdateBoardDialog } from "../boards/update-board-dialog";
import { CollaboratorDialog } from "../collaborators/collaborator-dialog";
import { NavMainMemo } from "./nav-main";
import { NavUserMemo } from "./nav-user";

type HomeSidebarProps = React.ComponentProps<typeof Sidebar>;

export function HomeSidebar({ ...props }: HomeSidebarProps) {
  const { user } = useAuth();

  if (!user) {
    throw redirect({ to: "/login" });
  }

  const useUpdateBoardDialogReturn = useUpdateBoardDialog();
  const useCollaboratorDialogReturn = useCollaboratorDialog();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Album className="!size-7" />
            <span className="text-xl font-semibold">{`Hello ${user.given_name}!`}</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainMemo
          openCollaboratorDialog={useCollaboratorDialogReturn.openCollaboratorDialog}
          openUpdateBoardDialog={useUpdateBoardDialogReturn.openUpdateBoardDialog}
        />
        <UpdateBoardDialog {...useUpdateBoardDialogReturn} />
        <CollaboratorDialog {...useCollaboratorDialogReturn} />
      </SidebarContent>
      <SidebarFooter>
        <NavUserMemo {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
