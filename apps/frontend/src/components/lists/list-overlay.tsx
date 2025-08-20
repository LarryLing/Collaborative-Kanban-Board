import { Ellipsis, GripVertical, Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Card as CardType, List } from "@/lib/types";
import CardButtonOverlay from "../cards/card-button-overlay";

type ListOverlayProps = {
  listTitle: List["title"];
  cards: CardType[];
};

export default function ListOverlay({ listTitle, cards }: ListOverlayProps) {
  return (
    <Card className="flex-shrink-0 gap-3 w-[275px] p-2 border opacity-50">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="cursor-grab">
            <GripVertical className="size-4" />
          </div>
          <Badge variant="secondary">{listTitle}</Badge>
          <Badge variant="outline" className="size-5">
            {cards.length}
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
      <div className="flex flex-col gap-y-2">
        {cards.map((card) => (
          <CardButtonOverlay key={card.id} title={card.title} />
        ))}
        <Button variant="ghost" className="w-full" size="sm">
          <Plus />
          <p className="text-xs">Create Card</p>
        </Button>
      </div>
    </Card>
  );
}
