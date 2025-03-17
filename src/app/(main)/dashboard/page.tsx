import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";
import { Separator } from "@/components/ui/separator";
import ListView from "@/components/blocks/dashboard/list-view";
import GalleryView from "@/components/blocks/dashboard/gallery-view";
import { processBoards } from "@/lib/utils";
import { OwnershipOptions, SortOptions } from "@/lib/types";

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
	const ownership = searchParams?.ownership || "";
	const sort = searchParams?.sort || "";
	const view = searchParams?.view || "";
	const bookmarked = searchParams?.bookmarked || "";
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

	const processedBoards = processBoards(
		userData.user.id,
		boardsData.map((item) => item.boards),
		bookmarked === "bookmarked",
		ownership as OwnershipOptions,
		sort as SortOptions,
		query,
	);

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
			{view === "list" ? (
				<ListView boards={processedBoards} />
			) : (
				<GalleryView boards={processedBoards} />
			)}
		</div>
	);
}
