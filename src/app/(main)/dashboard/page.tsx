import DashboardClientComponent from "@/components/blocks/dashboard/dashboard-client-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";

async function getUserProfile(
	supabase: SupabaseClient<Database>,
	userId: string,
) {
	const { data: userProfile, error: profileError } = await supabase
		.from("profiles")
		.select("*, socials(url)")
		.eq("id", userId)
		.single();

	if (profileError) throw profileError;

	return userProfile;
}

async function getBoards(supabase: SupabaseClient<Database>, userId: string) {
	const { data: boardsData, error: boardsError } = await supabase
		.from("profiles_boards_bridge")
		.select("board_id, boards(*)")
		.eq("profile_id", userId);

	if (boardsError) throw boardsError;

	return boardsData;
}

export default async function DashboardPage() {
	const supabase = await createClient();

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) throw userError;

	if (!userData.user) redirect("/login");

	const userProfilePromise = getUserProfile(supabase, userData.user.id);
	const boardsPromise = getBoards(supabase, userData.user.id);

	const [userProfile, boards] = await Promise.all([
		userProfilePromise,
		boardsPromise,
	]);

	return (
		<DashboardClientComponent
			boards={boards.map((item) => item.boards)}
			userProfile={userProfile}
		/>
	);
}
