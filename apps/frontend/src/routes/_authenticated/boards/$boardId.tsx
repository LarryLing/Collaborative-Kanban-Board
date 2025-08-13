import { useBoard } from "@/hooks/use-board";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/$boardId")({
  component: DynamicBoards,
});

function DynamicBoards() {
  const { boardId } = Route.useParams();

  const { board, isLoading } = useBoard(boardId);

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (!board) {
    return <p>Could not find board...</p>;
  }

  return <div>Hello {board.title}!</div>;
}
