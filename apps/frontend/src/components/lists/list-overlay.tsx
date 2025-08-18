import { Ellipsis, GripVertical, Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { List } from "@/lib/types";

type ListOverlayProps = {
  listTitle: List["title"];
};

export default function ListOverlay({ listTitle }: ListOverlayProps) {
  return (
    <Card className="flex-shrink-0 gap-3 w-[275px] p-2 border">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="size-4" />
          <Badge variant="secondary">{listTitle}</Badge>
          <Badge variant="outline" className="size-5">
            0
          </Badge>
        </div>
        <div className="flex justify-center items-center gap-1">
          <Button size="icon" variant="ghost" className="size-5">
            <Plus />
            <span className="sr-only">Create Card</span>
          </Button>
          <Button size="icon" variant="ghost" className="size-5">
            <Ellipsis />
            <span className="sr-only">More</span>
          </Button>
        </div>
      </div>
      <div className="flex-col gap-2">
        <Button variant="outline" className="w-full">
          <Plus />
          <p>Create Card</p>
        </Button>
      </div>
    </Card>
  );
}
