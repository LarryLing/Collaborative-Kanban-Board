import { BoardType } from "@/lib/types"
import React from "react"
import Board from "./board"

type BoardsProps = {
	boards: BoardType[]
}

export default function Boards({ boards }: BoardsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-4">
			{boards.map((board) => {
				return <Board {...board} key={board.id} />
			})}
		</div>
	)
}
