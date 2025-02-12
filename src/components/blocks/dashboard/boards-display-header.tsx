"use client"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ArrowDownAZ, Bookmark, List, Plus } from "lucide-react"
import React from "react"

export default function BoardsDisplayHeader() {
	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="font-semibold text-3xl">My Boards</h2>
			<div className="flex justify-between">
				<Button>
					<Plus className="h-4 w-4" /> New Board
				</Button>
				<ToggleGroup type="multiple" variant="outline">
					<ToggleGroupItem
						value="ownership"
						aria-label="Toggle ownership"
					>
						Owned by anyone
					</ToggleGroupItem>
					<ToggleGroupItem value="view" aria-label="Toggle view">
						<List className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem
						value="bookmarked"
						aria-label="Toggle strikethrough"
					>
						<Bookmark className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="sort" aria-label="Toggle sort">
						<ArrowDownAZ className="h-4 w-4" />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	)
}
