import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/$boardId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/boards/$boardId"!</div>;
}
