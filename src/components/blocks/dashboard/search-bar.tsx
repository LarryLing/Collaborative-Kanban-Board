import { ReadonlyURLSearchParams } from "next/navigation";
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

type SearchBarProps = {
	searchParams: ReadonlyURLSearchParams;
	handleSearch: (arg0: string) => void;
};

export default function SearchBar({
	searchParams,
	handleSearch,
}: SearchBarProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

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
