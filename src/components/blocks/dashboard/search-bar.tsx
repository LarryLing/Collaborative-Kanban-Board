import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useDebouncedCallback((query) => {
		const params = new URLSearchParams(searchParams);

		query ? params.set("query", query) : params.delete("query");

		replace(`${pathname}?${params.toString()}`);
	}, 500);

	return (
		<div className="hidden md:flex space-x-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<Toggle
								variant="outline"
								pressed={isSearchOpen}
								onPressedChange={() =>
									setIsSearchOpen(!isSearchOpen)
								}
							>
								<Search className="size-5" />
							</Toggle>
						</div>
					</TooltipTrigger>
					<TooltipContent>Search</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{isSearchOpen && (
				<Input
					type="search"
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
					className="w-[100px] md:w-[150px] lg:w-[175px] text-sm"
					placeholder="Search..."
					defaultValue={searchParams.get("query")?.toString()}
				/>
			)}
		</div>
	);
}
