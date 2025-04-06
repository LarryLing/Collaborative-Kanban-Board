import { Button } from "@/components/ui/button";
import { createBoard } from "@/lib/actions";
import { ViewOptions } from "@/lib/types";
import { Plus } from "lucide-react";
import React, { memo } from "react";

type NewBoardProps = {
	viewState: ViewOptions;
};

export default function NewBoard({ viewState }: NewBoardProps) {
	return (
		<Button
			variant="ghost"
			className={`${viewState === "gallery" ? "h-[280px]" : "h-[56px] overflow-hidden pl-4 pr-2"} w-full flex items-center justify-center gap-2`}
			onClick={createBoard}
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}

export const MemoizedNewBoard = memo(NewBoard);
