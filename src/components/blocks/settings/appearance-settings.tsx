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
import Image from "next/image";

export default function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const [font, setFont] = useState("Inter");

	return (
		<Card className="border-none shadow-none flex-auto">
			<CardHeader className="md:pt-0">
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<ThemeOption
							currentTheme={theme}
							theme="System"
							setTheme={setTheme}
						/>
						<ThemeOption
							currentTheme={theme}
							theme="Light"
							setTheme={setTheme}
						/>
						<ThemeOption
							currentTheme={theme}
							theme="Dark"
							setTheme={setTheme}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

type ThemeOptionProps = {
	currentTheme: string | undefined;
	theme: string;
	setTheme: React.Dispatch<React.SetStateAction<string>>;
};

function ThemeOption({ currentTheme, theme, setTheme }: ThemeOptionProps) {
	return (
		<div
			className="w-full h-[180px] cursor-pointer rounded-md border border-border overflow-hidden group"
			onClick={() => setTheme(theme.toLowerCase())}
		>
			<div className="w-full h-[130px] relative">
				<Image
					src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
					alt=""
					objectFit="cover"
					layout="fill"
				/>
			</div>
			<div className="h-[50px] flex justify-start items-center px-4 bg-inherit hover:bg-accent/60 transition-colors">
				<p className="font-semibold text-sm text-center">{theme}</p>
			</div>
		</div>
	);
}
