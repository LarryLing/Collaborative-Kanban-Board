import { BrillianceIcon } from "@/components/icons/icon"
import Link from "next/link"
import React from "react"

export default function Branding() {
	return (
		<Link href="/" className="flex item-center font-bold text-2xl gap-3">
			<BrillianceIcon />
			<span>Kanban Board</span>
		</Link>
	)
}
