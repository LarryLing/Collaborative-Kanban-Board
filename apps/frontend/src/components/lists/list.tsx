import type {
  Board,
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
import { verticalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LIST } from "@/lib/constants";
import { Badge } from "../ui/badge";
import CreateCardIconButton from "../cards/create-card-icon-button";
import CreateCardButton from "../cards/create-card-button";
import { Card } from "../ui/card";
import CardButton from "../cards/card-button";
import CardButtonOverlay from "../cards/card-button-overlay";

type ListProps = Pick<List, "id" | "title" | "position"> & {
  boardId: Board["id"];
  cards: CardType[];
  updateListMutation: UseListsReturnType["updateListMutation"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
  deleteCardMutation: UseCardsReturnType["deleteCardMutation"];
  openCreateCardDialog: UseCreateCardDialogReturnType["openCreateCardDialog"];
  openUpdateCardDialog: UseUpdateCardDialogReturnType["openUpdateCardDialog"];
};

export default function List({
  id,
  title,
  position,
  boardId,
  cards,
  updateListMutation,
  deleteListMutation,
  deleteCardMutation,
  openCreateCardDialog,
  openUpdateCardDialog,
}: ListProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: LIST,
      list: {
        id,
        board_id: boardId,
        title,
        position,
      },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card className="flex-shrink-0 gap-3 w-[275px] p-2 border" style={style}>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div ref={setNodeRef} {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="size-4" />
          </div>
          <UpdateListPopover
            open={open}
            setOpen={setOpen}
            boardId={boardId}
            listId={id}
            listTitle={title}
            updateListMutation={updateListMutation}
          />
          <Badge variant="outline" className="size-5">
            {cards.length}
          </Badge>
        </div>
        <div className="flex justify-center items-center gap-1">
          <CreateCardIconButton boardId={boardId} listId={id} openCreateCardDialog={openCreateCardDialog} />
          <ListActionsDropdown boardId={boardId} listId={id} deleteListMutation={deleteListMutation} />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {isDragging ? (
          cards.map((card) => <CardButtonOverlay key={card.id} title={card.title} />)
        ) : (
          <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <CardButton
                key={card.id}
                {...card}
                boardId={boardId}
                listId={id}
                deleteCardMutation={deleteCardMutation}
                openUpdateCardDialog={openUpdateCardDialog}
              />
            ))}
          </SortableContext>
        )}
        <CreateCardButton boardId={boardId} listId={id} openCreateCardDialog={openCreateCardDialog} />
      </div>
    </Card>
  );
}
