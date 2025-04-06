import { Button } from "@/components/ui/button";
import { OwnershipOptions } from "@/lib/types";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { useSyncExternalStore } from "react";
import { handleOwnershipChange, ownership } from "../../../lib/storage-utils";

export default function OwnershipDropdown() {
	const ownershipState = useSyncExternalStore(
		ownership.subscribe,
		ownership.getSnapshot,
	);

	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-[160px]">
								{ownershipState === "anyone" && "Owned by anyone"}
								{ownershipState === "me" && "Owned by me"}
								{ownershipState === "not-me" && "Not owned by me"}
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Ownership</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DropdownMenuRadioGroup
					value={ownershipState}
					onValueChange={(value) =>
						handleOwnershipChange(value as OwnershipOptions)
					}
				>
					<DropdownMenuRadioItem value="anyone">
						Owned by anyone
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="me">Owned by me</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="not-me">
						Not owned by me
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
