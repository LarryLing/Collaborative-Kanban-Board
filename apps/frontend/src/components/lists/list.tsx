import type {
  Card as CardType,
  List,
  UseCardsReturnType,
  UseCreateCardDialogReturnType,
  UseListsReturnType,
  UseUpdateCardDialogReturnType,
} from "@/lib/types";
import UpdateListPopover from "./update-list-popover";
import { useState } from "react";
import ListActionsDropdown from "./list-actions-dropdown";
import { GripVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import CreateCardIconButton from "../cards/create-card-icon-button";
import CreateCardButton from "../cards/create-card-button";
import { Card } from "../ui/card";
import CardButton from "../cards/card-button";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { CARD } from "@/lib/constants";

type ListProps = Pick<List, "id" | "board_id" | "title"> & {
  cards: CardType[];
  index: number;
  updateListMutation: UseListsReturnType["updateListMutation"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
  openUpdateCardDialog: UseUpdateCardDialogReturnType["openUpdateCardDialog"];
};

export default function List({
  id,
  board_id,
  title,
  cards,
  index,
  updateListMutation,
  deleteListMutation,
  deleteCardMutation,
  openCreateCardDialog,
  openUpdateCardDialog,
}: ListProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="flex-shrink-0 gap-2 w-[275px] p-2 border"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div {...provided.dragHandleProps} className="cursor-grab">
                  <GripVertical className="size-4" />
                </div>
                <UpdateListPopover
                  open={open}
                  setOpen={setOpen}
                  boardId={board_id}
                  listId={id}
                  listTitle={title}
                  updateListMutation={updateListMutation}
                />
                <Badge variant="outline" className="size-5">
                  {cards.length}
                </Badge>
              </div>
              <div className="flex justify-center items-center gap-1">
                <CreateCardIconButton boardId={board_id} listId={id} openCreateCardDialog={openCreateCardDialog} />
                <ListActionsDropdown boardId={board_id} listId={id} deleteListMutation={deleteListMutation} />
              </div>
            </div>
            <Droppable droppableId={id} type={CARD}>
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-y-2">
                    {cards.map((card, index) => (
                      <CardButton
                        key={card.id}
                        {...card}
                        index={index}
                        deleteCardMutation={deleteCardMutation}
                        openUpdateCardDialog={openUpdateCardDialog}
                      />
                    ))}
                    {provided.placeholder}
                    <CreateCardButton boardId={board_id} listId={id} openCreateCardDialog={openCreateCardDialog} />
                  </div>
                );
              }}
            </Droppable>
          </Card>
        );
      }}
    </Draggable>
  );
}
