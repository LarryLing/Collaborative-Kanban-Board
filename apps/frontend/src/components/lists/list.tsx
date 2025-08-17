import type { Board, List, UseListsReturnType } from "@/lib/types";
import { Card } from "../ui/card";
import UpdateListPopover from "./update-list-popover";
import { useState } from "react";
import ListActionsDropdown from "./list-actions-dropdown";
import { GripVertical } from "lucide-react";

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

  return (
    <Card className="flex-shrink-0 w-[250px] p-2 border">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
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
        </div>
        <ListActionsDropdown
          boardId={boardId}
          listId={listId}
          setOpen={setOpen}
          deleteListMutation={deleteListMutation}
        />
      </div>
    </Card>
  );
}
