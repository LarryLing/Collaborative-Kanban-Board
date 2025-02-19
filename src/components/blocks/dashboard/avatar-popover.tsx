"use client";

import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings2 } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signout } from "@/lib/actions";

export default function AvatarPopover({
	id,
	display_name,
	email,
	role,
	bio,
	avatar,
}: UserProfile) {
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar>
					<AvatarImage src={avatar} />
					<AvatarFallback>
						{display_name.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent
				className="z-[9999] w-[312px] hidden md:block p-4 space-y-3"
				hideWhenDetached
			>
				<div className="flex justify-start items-center">
					<Avatar>
						<AvatarImage src={avatar} />
						<AvatarFallback>
							{display_name.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="ml-2">
						<h3 className="font-bold">{display_name}</h3>
						<p className="text-sm text-zinc-500 w-[190px] overflow-hidden whitespace-nowrap text-ellipsis">
							{email}
						</p>
					</div>
				</div>
				<Separator className="w-full" />
				{bio && (
					<>
						<div className="space-y-1">
							<h3 className="font-medium">About Me</h3>
							{<p className="text-sm text-zinc-500">{bio}</p>}
						</div>
						<Separator className="w-full" />
					</>
				)}
				<div className="space-y-1">
					<h3 className="font-medium">URLs</h3>
					<ul className="underline text-sm space-y-1 text-zinc-500">
						<li>https://canvas.northwestern.edu/</li>
						<li>https://caesar.northwestern.edu/</li>
					</ul>
				</div>
				<Separator className="w-full" />
				<div className="flex justify-center items-center gap-5 h-9">
					<Button variant="ghost">
						<Settings2 />
						Settings
					</Button>
					<Separator orientation="vertical" />
					<Button variant="ghost" onClick={signout}>
						<LogOut />
						Sign Out
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
