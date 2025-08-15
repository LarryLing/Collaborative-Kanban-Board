import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HomeSidebar } from "@/components/sidebar/home-sidebar";
import { HomeHeader } from "@/components/sidebar/home-header";
import { UpdateBoardDialogProvider } from "@/contexts/update-board-dialog-provider";
import { CollaboratorDialogProvider } from "@/contexts/collaborator-dialog-provider";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <UpdateBoardDialogProvider>
        <CollaboratorDialogProvider>
          <HomeSidebar variant="inset" />
          <SidebarInset>
            <HomeHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </SidebarInset>
        </CollaboratorDialogProvider>
      </UpdateBoardDialogProvider>
    </SidebarProvider>
  );
}
