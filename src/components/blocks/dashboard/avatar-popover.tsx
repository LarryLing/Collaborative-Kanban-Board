"use client";

import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutGrid, LinkIcon, LogOut, Settings2 } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signout } from "@/lib/actions";
import {
	FacebookIcon,
	GithubIcon,
	InstagramIcon,
	LinkedInIcon,
	TwitterXIcon,
} from "@/components/icons/icon";
import Link from "next/link";

type AvatarPopoverProps = {
	userProfile: UserProfile;
};

export default function AvatarPopover({ userProfile }: AvatarPopoverProps) {
	const test_socials = [
		"https://www.linkedin.com/in/larry-ling-student/",
		"https://github.com/LarryLing",
		"https://x.com/sza",
	];

	const { display_name, email, bio, avatar } = userProfile;

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
				className="z-[9999] w-[312px] hidden md:block space-y-3"
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
				<p className="text-sm">{bio}</p>
				<Socials socials={test_socials} />

				{/* <div className="space-y-1 px-4"></div>
				<div className="space-y-1 px-4"></div> */}
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
						<Link href="/settings/profile">
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

type SocialsProps = {
	socials: string[];
};

function Socials({ socials }: SocialsProps) {
	function getSocialIcon(social: string) {
		const url = new URL(social);

		switch (url.hostname) {
			case "www.linkedin.com":
				return (
					<>
						<LinkedInIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);

			case "github.com":
				return (
					<>
						<GithubIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);

			case "www.instagram.com":
				return (
					<>
						<InstagramIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);

			case "www.facebook.com":
				return (
					<>
						<FacebookIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);

			case "x.com":
				return (
					<>
						<TwitterXIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);

			default:
				return (
					<>
						<LinkIcon className="size-4" fill="currentColor" />
						<Link
							href={social}
							className="underline-offset-4 hover:underline"
						>
							{url.pathname.substring(1)}
						</Link>
					</>
				);
		}
	}

	return (
		<ul className="text-sm space-y-1">
			{socials.map((social) => (
				<Button variant="link" className="flex" key={social}>
					{getSocialIcon(social)}
				</Button>
			))}
		</ul>
	);
}
