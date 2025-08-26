import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getBoardById } from "@/api/boards";
import { CreateCardDialog } from "@/components/cards/create-card-dialog";
import { UpdateCardDialog } from "@/components/cards/update-card-dialog";
import CreateListPopover from "@/components/lists/create-list-popover";
import List from "@/components/lists/list";
import { useCards } from "@/hooks/use-cards";
import { useCreateCardDialog } from "@/hooks/use-create-card-dialog";
import { useDnd } from "@/hooks/use-dnd";
import { useLists } from "@/hooks/use-lists";
import { useUpdateCardDialog } from "@/hooks/use-update-card-dialog";
import { LIST } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/boards/$boardId")({
  beforeLoad: async ({ params }) => {
    try {
      const board = await getBoardById({ boardId: params.boardId });
      return { board };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to retrieve board:", errorMessage);
      throw redirect({ to: "/boards" });
    }
  },
  component: DynamicBoards,
});

function DynamicBoards() {
  const { boardId } = Route.useParams();

  const {
    createListMutation,
    deleteListMutation,
    isLoading: isListsLoading,
    lists,
    updateListMutation,
    updateListPositionMutation,
  } = useLists(boardId);

  const {
    cards,
    createCardMutation,
    deleteCardMutation,
    isLoading: isCardsLoading,
    updateCardMutation,
    updateCardPositionMutation,
  } = useCards(boardId);

  const useCreateCardDialogReturn = useCreateCardDialog(cards, createCardMutation);

  const useUpdateCardDialogReturn = useUpdateCardDialog(updateCardMutation);

  const { dndData, handleDragEnd } = useDnd(
    boardId,
    lists,
    cards,
    updateCardPositionMutation,
    updateListPositionMutation,
  );

  if (isListsLoading || isCardsLoading) {
    return <p>Loading board...</p>;
  }

  if (!lists || !cards) {
    return <p>Could not load board...</p>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable direction="horizontal" droppableId="all-lists" type={LIST}>
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex justify-start items-start space-x-3 text-sm overflow-scroll no-scrollbar"
              >
                {dndData.listOrder.map((listId, index) => {
                  const list = dndData.lists[listId];
                  const cards = list.cardIds.map((cardId) => dndData.cards[cardId]);

                  return (
                    <List
                      key={list.id}
                      {...list}
                      cards={cards}
                      deleteCardMutation={deleteCardMutation}
                      deleteListMutation={deleteListMutation}
                      index={index}
                      openCreateCardDialog={useCreateCardDialogReturn.openCreateCardDialog}
                      openUpdateCardDialog={useUpdateCardDialogReturn.openUpdateCardDialog}
                      updateListMutation={updateListMutation}
                    />
                  );
                })}
                {provided.placeholder}
                <CreateListPopover boardId={boardId} createListMutation={createListMutation} lists={lists} />
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
