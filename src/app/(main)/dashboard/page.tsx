import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import DashboardContent from "@/components/blocks/dashboard/dashboard-content";
import DashboardHeader from "@/components/blocks/dashboard/dashboard-header";
import { selectBoardsByProfileId } from "@/lib/queries";

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

	const { data: boardsData, error: boardsError } = await selectBoardsByProfileId(
		supabase,
		userData.user.id,
	);

	if (boardsError) throw boardsError;

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<DashboardHeader />
			<Separator className="w-full" />
			<DashboardContent
				id={userData.user.id}
				boards={boardsData}
				viewerId={userData.user.id}
				query={query}
			/>
		</div>
	);
}
