import type { Board, List, UseListsReturnType } from "@/lib/types";
import { Card } from "../ui/card";
import UpdateListPopover from "./update-list-popover";
import { useState } from "react";
import ListActionsDropdown from "./list-actions-dropdown";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LIST } from "@/lib/constants";
import { Badge } from "../ui/badge";
import CreateCardIconButton from "../cards/create-card-icon-button";
import CreateCardButton from "../cards/create-card-button";

type ListProps = {
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["title"];
  updateListMutation: UseListsReturnType["updateListMutation"];
  deleteListMutation: UseListsReturnType["deleteListMutation"];
};

export default function List({
  boardId,
  listId,
  listTitle,
  updateListMutation,
  deleteListMutation,
}: ListProps) {
  const [open, setOpen] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: listId,
    data: {
      type: LIST,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      className={`flex-shrink-0 gap-3 w-[275px] p-2 border ${isDragging && "opacity-50"}`}
      style={style}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-grab"
          >
            <GripVertical className="size-4" />
          </div>
          <UpdateListPopover
            open={open}
            setOpen={setOpen}
            boardId={boardId}
            listId={listId}
            listTitle={listTitle}
            updateListMutation={updateListMutation}
          />
          <Badge variant="outline" className="size-5">
            0
          </Badge>
        </div>
        <div className="flex justify-center items-center gap-1">
          <CreateCardIconButton />
          <ListActionsDropdown
            boardId={boardId}
            listId={listId}
            deleteListMutation={deleteListMutation}
          />
        </div>
      </div>
      <div className="flex-col gap-2">
        <CreateCardButton />
      </div>
    </Card>
  );
}
