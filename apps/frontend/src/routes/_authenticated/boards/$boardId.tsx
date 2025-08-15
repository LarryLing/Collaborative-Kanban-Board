import { useBoards } from "@/hooks/use-boards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/$boardId")({
  component: DynamicBoards,
});

function DynamicBoards() {
  const { boardId } = Route.useParams();

  const { boards, isLoading } = useBoards();

  const board = boards?.find((board) => board.id === boardId);

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (!board) {
    return <p>Could not find board...</p>;
  }

  return (
    <p>
      Hello {board.title} {boardId}!
    </p>
  );
}
