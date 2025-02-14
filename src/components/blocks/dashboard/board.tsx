import React from "react"

type BoardProps = {
	id: string
	owner: string
	title: string
}

export default function Board({ id, owner, title }: BoardProps) {
	return (
		<div className="w-full h-[240px] border border-border rounded-md overflow-hidden">
			<div className="w-full h-[160px] bg-border"></div>
			<div className="w-full h-[80px]">{title}</div>
		</div>
	)
}
