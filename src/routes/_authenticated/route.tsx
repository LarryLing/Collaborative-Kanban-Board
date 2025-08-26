import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { HomeHeader } from "@/components/sidebar/home-header";
import { HomeSidebar } from "@/components/sidebar/home-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
          "--header-height": "calc(var(--spacing) * 12)",
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
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
    </SidebarProvider>
  );
}
