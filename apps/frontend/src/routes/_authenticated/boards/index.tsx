import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/boards/"!</div>;
}
