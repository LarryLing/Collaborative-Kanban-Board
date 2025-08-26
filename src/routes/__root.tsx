import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import type { AuthContextType, ThemeContextType } from "@/lib/types";

import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
  theme: ThemeContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-right" richColors />
    </>
  ),
});
