import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/")({
  component: Boards,
});

function Boards() {
  return <div>Select or create a board to continue</div>;
}
