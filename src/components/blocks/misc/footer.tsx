import Link from "next/link";
import React from "react";

export default function Footer() {
	return (
		<footer className="w-full px-4 py-5 flex justify-between items-center border-t-[1px] border-border text-sm">
			<p>
				Built with{" "}
				<Link
					href="https://nextjs.org/"
					target="_blank"
					className="inline underline"
				>
					NextJS
				</Link>
				,{" "}
				<Link
					href="https://supabase.com/"
					target="_blank"
					className="inline underline"
				>
					Supabase
				</Link>
				, and{" "}
				<Link
					href="https://ui.shadcn.com/"
					target="_blank"
					className="inline underline"
				>
					ShadCN
				</Link>
				. The source code is available on{" "}
				<Link
					href="https://github.com/LarryLing/Kanban-Board"
					target="_blank"
					className="inline underline"
				>
					GitHub
				</Link>
				.
			</p>
		</footer>
	);
}
