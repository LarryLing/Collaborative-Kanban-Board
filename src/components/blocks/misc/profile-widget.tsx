import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileWidget = {
	displayName: string;
	email: string;
	avatarUrl: string | undefined;
	className?: string;
};

export default function ProfileWidget({
	displayName,
	email,
	avatarUrl,
	className,
}: ProfileWidget) {
	return (
		<div className="flex justify-start items-center w-full">
			<Avatar>
				<AvatarImage src={avatarUrl} />
				<AvatarFallback>
					{displayName.substring(0, 2).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="ml-2">
				<h3 className="font-bold">{displayName}</h3>
				<p className={`text-sm text-muted-foreground ${className} truncate`}>
					{email}
				</p>
			</div>
		</div>
	);
}
