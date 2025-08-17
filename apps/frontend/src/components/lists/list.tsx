import type { Board, List, UseListsReturnType } from "@/lib/types";
import { Card } from "../ui/card";
import UpdateListPopover from "./update-list-popover";

type ListProps = {
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["title"];
  updateListMutation: UseListsReturnType["updateListMutation"];
};

export default function List({
  boardId,
  listId,
  listTitle,
  updateListMutation,
}: ListProps) {
  return (
    <Card className="flex-shrink-0 w-[250px] p-2 border">
      <UpdateListPopover
        boardId={boardId}
        listId={listId}
        listTitle={listTitle}
        updateListMutation={updateListMutation}
      />
    </Card>
  );
}
