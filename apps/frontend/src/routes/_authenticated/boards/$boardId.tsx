import NewListPopover from "@/components/lists/new-list-popover";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { createFileRoute } from "@tanstack/react-router";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import List from "@/components/lists/list";

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
    deleteListMutation,
    updateListMutation,
    updateListPositionMutation,
  } = useLists(boardId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeListIndex = lists.findIndex((list) => list.id === active.id);
      const overListIndex = lists.findIndex((list) => list.id === over.id);

      let newListPosition;
      if (activeListIndex < overListIndex) {
        if (overListIndex + 1 >= lists.length) {
          newListPosition = generateKeyBetween(
            lists[overListIndex].position,
            null,
          );
        } else {
          newListPosition = generateKeyBetween(
            lists[overListIndex].position,
            lists[overListIndex + 1].position,
          );
        }
      } else if (activeListIndex > overListIndex) {
        if (overListIndex - 1 < 0) {
          newListPosition = generateKeyBetween(
            null,
            lists[overListIndex].position,
          );
        } else {
          newListPosition = generateKeyBetween(
            lists[overListIndex - 1].position,
            lists[overListIndex].position,
          );
        }
      } else {
        return;
      }

      await updateListPositionMutation({
        boardId,
        listId: active.id as string,
        listPosition: newListPosition,
      });
    }
  };

  const board = boards?.find((board) => board.id === boardId);

  if (isBoardsLoading || isListsLoading) {
    return <p>Loading board...</p>;
  }

  if (!board) {
    return <p>Could not find board...</p>;
  }

  return (
    <div className="h-full flex justify-start gap-3 overflow-auto text-sm">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lists.map((list) => list.id)}
          strategy={horizontalListSortingStrategy}
        >
          {lists?.map((list) => (
            <List
              key={list.id}
              boardId={boardId}
              listId={list.id}
              listTitle={list.title}
              updateListMutation={updateListMutation}
              deleteListMutation={deleteListMutation}
            />
          ))}
        </SortableContext>
      </DndContext>
      <NewListPopover
        boardId={boardId}
        lists={lists}
        createListMutation={createListMutation}
      />
    </div>
  );
}
