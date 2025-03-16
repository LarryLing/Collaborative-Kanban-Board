import DashboardClientComponent from "@/components/blocks/dashboard/dashboard-client-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const supabase = await createClient();
	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const { data: boardsData, error: boardsError } = await supabase
		.from("profiles_boards_bridge")
		.select("board_id, boards(*)")
		.eq("profile_id", user.user.id);

	if (boardsError) throw boardsError;

	const boards = boardsData.map((item) => item.boards);

	const { data: userProfile, error: profileError } = await supabase
		.from("profiles")
		.select("*, socials(url)")
		.eq("id", user.user.id)
		.single();

	if (profileError) throw profileError;

	const { data: publicUrl } = await supabase.storage
		.from("avatars")
		.getPublicUrl(userProfile.avatar_path || "");

	return (
		<div className="flex flex-col justify-center items-center">
			<DashboardClientComponent
				boards={boards}
				userProfile={userProfile}
				publicUrl={publicUrl.publicUrl}
			/>
		</div>
	);
}
