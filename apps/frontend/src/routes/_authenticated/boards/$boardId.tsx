import List from "@/components/lists/list";
import NewListPopover from "@/components/lists/new-list-popover";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/boards/$boardId")({
  component: DynamicBoards,
});

function DynamicBoards() {
  const { boardId } = Route.useParams();

  const { boards, isLoading: isBoardsLoading } = useBoards();

  const {
    lists,
    isLoading: isListsLoading,
    createListMutation,
    updateListMutation,
  } = useLists(boardId);

  const board = boards?.find((board) => board.id === boardId);

  if (isBoardsLoading || isListsLoading) {
    return <p>Loading board...</p>;
  }

  if (!board) {
    return <p>Could not find board...</p>;
  }

  return (
    <div className="h-full flex justify-start gap-3 overflow-auto text-sm">
      {lists?.map((list) => (
        <List
          key={list.id}
          boardId={boardId}
          listId={list.id}
          listTitle={list.title}
          updateListMutation={updateListMutation}
        />
      ))}
      <NewListPopover
        boardId={boardId}
        createListMutation={createListMutation}
      />
    </div>
  );
}
