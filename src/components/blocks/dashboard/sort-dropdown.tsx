import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { SortOptions } from "@/lib/types";
import { ArrowDownAZ } from "lucide-react";
import { useSyncExternalStore } from "react";
import { handleSortChange, sort } from "../../../lib/storage-utils";

export default function SortDropdown() {
	const sortState = useSyncExternalStore(sort.subscribe, sort.getSnapshot);

	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="px-2 py-0">
								<ArrowDownAZ className="size-4" />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Sort Options</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DropdownMenuRadioGroup
					value={sortState}
					onValueChange={(value) => handleSortChange(value as SortOptions)}
				>
					<DropdownMenuRadioItem value="last-opened">
						Last opened
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="asc">
						Sort ascending
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="des">
						Sort descending
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
