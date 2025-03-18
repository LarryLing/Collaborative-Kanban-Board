import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import BoardsDisplay from "@/components/blocks/dashboard/boards-display";
import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";

export default async function DashboardPage(props: {
	searchParams?: Promise<{
		ownership?: string;
		sort?: string;
		view?: string;
		bookmarked?: string;
		query?: string;
	}>;
}) {
	const searchParams = await props.searchParams;

	const query = searchParams?.query || "";

	const supabase = await createClient();

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) throw userError;

	if (!userData.user) redirect("/login");

	const { data: boardsData, error: boardsError } = await supabase
		.from("profiles_boards_bridge")
		.select("board_id, boards(*)")
		.eq("profile_id", userData.user.id);

	if (boardsError) throw boardsError;

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
			<BoardsDisplay
				id={userData.user.id}
				boards={boardsData.map((item) => item.boards)}
				query={query}
			/>
		</div>
	);
}
