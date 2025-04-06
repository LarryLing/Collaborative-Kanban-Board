import { Button } from "@/components/ui/button";
import { UseColumnsType } from "@/hooks/use-columns";
import { Plus } from "lucide-react";
import React, { memo } from "react";

type NewColumnProps = {
	createColumn: UseColumnsType["createColumn"];
};

export default function NewColumn({ createColumn }: NewColumnProps) {
	return (
		<Button variant="ghost" onClick={createColumn}>
			<Plus />
			<span>New Column</span>
		</Button>
	);
}

export const MemoizedNewColumn = memo(NewColumn);
