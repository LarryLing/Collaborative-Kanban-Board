import CreateListPopover from "@/components/lists/create-list-popover";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { createFileRoute } from "@tanstack/react-router";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import List from "@/components/lists/list";
import { useCards } from "@/hooks/use-cards";
import { useCreateCardDialog } from "@/hooks/use-create-card-dialog";
import { CreateCardDialog } from "@/components/cards/create-card-dialog";
import { useUpdateCardDialog } from "@/hooks/use-update-card-dialog";
import { UpdateCardDialog } from "@/components/cards/update-card-dialog";
import CardButtonOverlay from "@/components/cards/card-button-overlay";
import ListOverlay from "@/components/lists/list-overlay";
import { useDND } from "@/hooks/use-dnd";

//TODO: Add check for user access permissions before loading page
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
    // updateListPositionMutation,
  } = useLists(boardId);

  const {
    cards,
    isLoading: isCardsLoading,
    createCardMutation,
    deleteCardMutation,
    updateCardMutation,
    // updateCardPositionMutation,
  } = useCards(boardId);

  const useCreateCardDialogReturn = useCreateCardDialog(
    cards,
    createCardMutation,
  );

  const useUpdateCardDialogReturn = useUpdateCardDialog(updateCardMutation);

  const {
    containers,
    activeList,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDND(lists, cards);

  const board = boards?.find((board) => board.id === boardId);

  if (isBoardsLoading || isListsLoading || isCardsLoading) {
    return <p>Loading board...</p>;
  }

  if (!board || !lists) {
    return <p>Could not load board...</p>;
  }

  return (
    <div className="flex justify-start items-start gap-3 overflow-auto text-sm">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={containers.map((container) => container.list.id)}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((container) => {
            return (
              <List
                key={container.list.id}
                {...container.list}
                boardId={boardId}
                cards={container.cards}
                updateListMutation={updateListMutation}
                deleteListMutation={deleteListMutation}
                deleteCardMutation={deleteCardMutation}
                openCreateCardDialog={
                  useCreateCardDialogReturn.openCreateCardDialog
                }
                openUpdateCardDialog={
                  useUpdateCardDialogReturn.openUpdateCardDialog
                }
              />
            );
          })}
        </SortableContext>
        <DragOverlay className="cursor-grabbing">
          {activeList && (
            <ListOverlay
              listTitle={activeList.title}
              cards={
                containers.find(
                  (container) => container.list.id === activeList.id,
                )?.cards || []
              }
            />
          )}
          {activeCard && <CardButtonOverlay title={activeCard.title} />}
        </DragOverlay>
      </DndContext>
      <CreateListPopover
        boardId={boardId}
        lists={lists}
        createListMutation={createListMutation}
      />
      <CreateCardDialog {...useCreateCardDialogReturn} />
      <UpdateCardDialog {...useUpdateCardDialogReturn} />
    </div>
  );
}
