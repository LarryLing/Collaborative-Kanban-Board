import CreateListPopover from "@/components/lists/create-list-popover";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { createFileRoute } from "@tanstack/react-router";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import List from "@/components/lists/list";
import { useState } from "react";
import type { List as ListType } from "@/lib/types";
import { LIST } from "@/lib/constants";
import ListOverlay from "@/components/lists/list-overlay";

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

  const [activeList, setActiveList] = useState<ListType | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    if (!lists) return;

    const { active } = event;

    if (active.data.current?.type === LIST) {
      setActiveList(() => {
        return lists.find((list) => list.id === active.id) || null;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!lists) return;

    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

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

    setActiveList(null);

    await updateListPositionMutation({
      boardId,
      listId: active.id as string,
      listPosition: newListPosition,
    });
  };

  const board = boards?.find((board) => board.id === boardId);

  if (isBoardsLoading || isListsLoading) {
    return <p>Loading board...</p>;
  }

  if (!board || !lists) {
    return <p>Could not load board...</p>;
  }

  return (
    <div className="flex justify-start items-start gap-3 overflow-auto text-sm">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lists.map((list) => list.id)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
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
        <DragOverlay className="cursor-grabbing">
          {activeList && <ListOverlay listTitle={activeList.title} />}
        </DragOverlay>
      </DndContext>
      <CreateListPopover
        boardId={boardId}
        lists={lists}
        createListMutation={createListMutation}
      />
    </div>
  );
}
