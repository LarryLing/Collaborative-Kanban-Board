"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

export default function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const [font, setFont] = useState("Inter");

	return (
		<Card className="border-none shadow-none">
			<CardHeader className="pt-0">
				<CardTitle>Appearance</CardTitle>
				<CardDescription>
					Choose how the site looks to you. Selections are applied
					immediately and saved automatically.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Separator className="w-full" />
				<div className="space-y-1">
					<Label htmlFor="language">Font</Label>
					<Select onValueChange={setFont} defaultValue={font}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Inter">Inter</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<p className="text-sm text-muted-foreground font-normal">
						Set the font you want to use in the dashboard.
					</p>
				</div>
				<div className="space-y-1">
					<Label htmlFor="email">Theme</Label>
					<p className="text-sm text-muted-foreground font-normal">
						Switch between light and dark themes.
					</p>
					<div className="space-x-4">
						<ThemeOption
							theme="Light"
							background="bg-white"
							skeleton="black"
							setTheme={setTheme}
						/>
						<ThemeOption
							theme="Dark"
							background="bg-black"
							skeleton="white"
							setTheme={setTheme}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

type ThemeOptionProps = {
	theme: string;
	background: string;
	skeleton: string;
	setTheme: React.Dispatch<React.SetStateAction<string>>;
};

function ThemeOption({
	theme,
	background,
	skeleton,
	setTheme,
}: ThemeOptionProps) {
	return (
		<div
			className="max-w-[240px] w-full inline-block space-y-1 cursor-pointer"
			onClick={() => setTheme(theme.toLowerCase())}
		>
			<div className="md:max-h-none h-[160px] border border-border rounded-md overflow-hidden group">
				<div
					className={`h-full flex flex-col justify-center items-center space-y-3 ${background}`}
				>
					<div
						className={`h-[75px] w-[200px] rounded-[6px] border border-${skeleton}/30`}
					/>
					<div className="space-y-2">
						<div
							className={`h-4 w-[200px] rounded-[6px] bg-${skeleton}`}
						/>
						<div
							className={`h-4 w-[150px] rounded-[6px] bg-${skeleton}`}
						/>
					</div>
				</div>
			</div>
			<p className="font-semibold text-sm text-center">{theme}</p>
		</div>
	);
}
