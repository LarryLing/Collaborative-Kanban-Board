import React from "react";

type DropindicatorProps = {
	beforeId?: string;
	columnId: string;
};

export default function DropIndicator({
	beforeId,
	columnId,
}: DropindicatorProps) {
	return (
		<div
			data-before={beforeId || "-1"}
			data-column={columnId}
			className="my-1 h-0.5 w-full bg-blue-400 opacity-0"
		/>
	);
}
