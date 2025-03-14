"use client";

import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutGrid, LogOut, Settings2 } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signout } from "@/lib/actions";
import Link from "next/link";
import { getSocialIcon } from "@/lib/utils";

type AvatarPopoverProps = {
	userProfile: UserProfile;
};

export default function AvatarPopover({ userProfile }: AvatarPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar>
					<AvatarImage src={userProfile.avatarUrl} />
					<AvatarFallback>
						{userProfile.displayName.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent
				className="z-[9999] w-[312px] hidden md:block space-y-3"
				hideWhenDetached
			>
				<div className="flex justify-start items-center">
					<Avatar>
						<AvatarImage src={userProfile.avatarUrl} />
						<AvatarFallback>
							{userProfile.displayName
								.substring(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="ml-2">
						<h3 className="font-bold">{userProfile.displayName}</h3>
						<p className="text-sm text-zinc-500 w-[190px] overflow-hidden whitespace-nowrap text-ellipsis">
							{userProfile.email}
						</p>
					</div>
				</div>
				{userProfile.aboutMe && (
					<>
						<Separator className="w-full" />
						<p className="text-sm">{userProfile.aboutMe}</p>
					</>
				)}
				{userProfile.socials.length > 0 && (
					<>
						<Separator className="w-full" />
						<div className="text-sm space-y-1">
							{userProfile.socials
								.filter((social) => social !== "")
								.map((social, index) => (
									<Button
										variant="link"
										className="flex"
										key={`social_${index}`}
									>
										{getSocialIcon(social)}
										<Link
											href={social}
											className="underline-offset-4 hover:underline"
										>
											{new URL(social).pathname.substring(
												1,
											)}
										</Link>
									</Button>
								))}
						</div>
					</>
				)}
				<Separator className="w-full" />
				<div className="flex flex-col justify-center items-center gap-2">
					<Button
						variant="ghost"
						className="w-full justify-start"
						asChild
					>
						<Link href="/dashboard">
							<LayoutGrid />
							Dashboard
						</Link>
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start"
						asChild
					>
						<Link href="/settings">
							<Settings2 />
							Settings
						</Link>
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={signout}
					>
						<LogOut />
						Sign Out
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
