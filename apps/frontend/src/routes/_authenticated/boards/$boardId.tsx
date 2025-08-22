import CreateListPopover from "@/components/lists/create-list-popover";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { createFileRoute } from "@tanstack/react-router";
import List from "@/components/lists/list";
import { useCards } from "@/hooks/use-cards";
import { useCreateCardDialog } from "@/hooks/use-create-card-dialog";
import { CreateCardDialog } from "@/components/cards/create-card-dialog";
import { useUpdateCardDialog } from "@/hooks/use-update-card-dialog";
import { UpdateCardDialog } from "@/components/cards/update-card-dialog";
import { useDnd } from "@/hooks/use-dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { LIST } from "@/lib/constants";

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
    updateListPositionMutation,
  } = useLists(boardId);

  const {
    cards,
    isLoading: isCardsLoading,
    createCardMutation,
    deleteCardMutation,
    updateCardMutation,
    updateCardPositionMutation,
  } = useCards(boardId);

  const useCreateCardDialogReturn = useCreateCardDialog(cards, createCardMutation);

  const useUpdateCardDialogReturn = useUpdateCardDialog(updateCardMutation);

  const { data, handleDragEnd } = useDnd(boardId, lists, cards, updateCardPositionMutation, updateListPositionMutation);

  const board = boards?.find((board) => board.id === boardId);

  if (isBoardsLoading || isListsLoading || isCardsLoading) {
    return <p>Loading board...</p>;
  }

  if (!board || !lists) {
    return <p>Could not load board...</p>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type={LIST}>
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex justify-start items-start space-x-3 overflow-x-scroll text-sm"
              >
                {data.listOrder.map((listId, index) => {
                  const list = data.lists[listId];
                  const cards = list.cardIds.map((cardId) => data.cards[cardId]);

                  return (
                    <List
                      key={list.id}
                      {...list}
                      cards={cards}
                      index={index}
                      updateListMutation={updateListMutation}
                      deleteListMutation={deleteListMutation}
                      deleteCardMutation={deleteCardMutation}
                      openCreateCardDialog={useCreateCardDialogReturn.openCreateCardDialog}
                      openUpdateCardDialog={useUpdateCardDialogReturn.openUpdateCardDialog}
                    />
                  );
                })}
                {provided.placeholder}
                <CreateListPopover boardId={boardId} lists={lists} createListMutation={createListMutation} />
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
      <CreateCardDialog {...useCreateCardDialogReturn} />
      <UpdateCardDialog {...useUpdateCardDialogReturn} />
    </>
  );
}
