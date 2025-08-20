import type { Card } from "@/lib/types";
import { Ellipsis, GripVertical } from "lucide-react";
import { Button } from "../ui/button";

type CardButtonOverlayProps = Pick<Card, "title">;

export default function CardButtonOverlay({ title }: CardButtonOverlayProps) {
  return (
    <div className="w-[257px] flex items-center justify-between gap-2 p-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs dark:bg-input/30 dark:border-input cursor-pointer opacity-50">
      <div className="flex items-center gap-2">
        <div>
          <GripVertical className="size-4" />
        </div>
        <p className="max-w-[180px] truncate ">{title}</p>
      </div>
      <Button size="icon" variant="ghost" className="size-5">
        <Ellipsis />
        <span className="sr-only">More</span>
      </Button>
    </div>
  );
}
