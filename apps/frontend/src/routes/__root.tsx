import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

interface MyRouterContext {
  auth: AuthContextProps;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
