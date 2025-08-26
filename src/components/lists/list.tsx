import { Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { useState } from "react";

import type {
  Card as CardType,
  List,
  UseCardsReturnType,
  UseCreateCardDialogReturnType,
  UseListsReturnType,
  UseUpdateCardDialogReturnType,
} from "@/lib/types";

import { CARD } from "@/lib/constants";

import CardButton from "../cards/card-button";
import CreateCardButton from "../cards/create-card-button";
import CreateCardIconButton from "../cards/create-card-icon-button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import ListActionsDropdown from "./list-actions-dropdown";
import UpdateListPopover from "./update-list-popover";

type ListProps = Pick<List, "board_id" | "id" | "title"> & {
  cards: CardType[];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
  index: number;
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
  openUpdateCardDialog: UseUpdateCardDialogReturnType["openUpdateCardDialog"];
  updateListMutation: UseListsReturnType["updateListMutation"];
};

export default function List({
  board_id,
  cards,
  deleteCardMutation,
  deleteListMutation,
  id,
  index,
  openCreateCardDialog,
  openUpdateCardDialog,
  title,
  updateListMutation,
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
                  boardId={board_id}
                  listId={id}
                  listTitle={title}
                  open={open}
                  setOpen={setOpen}
                  updateListMutation={updateListMutation}
                />
                <Badge className="size-5" variant="outline">
                  {cards.length}
                </Badge>
              </div>
              <div className="flex justify-center items-center gap-1">
                <CreateCardIconButton boardId={board_id} listId={id} openCreateCardDialog={openCreateCardDialog} />
                <ListActionsDropdown boardId={board_id} deleteListMutation={deleteListMutation} listId={id} />
              </div>
            </div>
            <Droppable droppableId={id} type={CARD}>
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {cards.map((card, index) => (
                      <CardButton
                        key={card.id}
                        {...card}
                        deleteCardMutation={deleteCardMutation}
                        index={index}
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
