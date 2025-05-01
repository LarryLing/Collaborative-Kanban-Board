import { BrillianceIcon } from "@/components/icons/icon";
import Link from "next/link";
import React from "react";

export default function Branding({ href }: { href: string }) {
	return (
		<Link
			href={`${href}`}
			className="flex item-center font-bold text-2xl gap-3"
			aria-label="Go back"
		>
			<BrillianceIcon />
			<span className="hidden sm:inline text-nowrap">Kanban Board</span>
		</Link>
	);
}
