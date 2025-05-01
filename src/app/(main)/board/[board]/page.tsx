import BoardContent from "@/components/blocks/board/board-content";
import BoardHeader from "@/components/blocks/board/board-header";
import RefreshComponent from "@/components/blocks/board/refresh-component";
import { Separator } from "@/components/ui/separator";
import {
	selectBoardByBoardAndProfileId,
	selectCardsByBoardId,
	selectCollaboratorsByBoardId,
	selectColumnsByBoardId,
	selectPermissionsByProfileIdAndBoardId,
	selectProfileByProfileId,
	updateBoardLastOpenedColumn,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function BoardPage({
	params,
}: {
	params: Promise<{ board: string }>;
}) {
	const { board: boardId } = await params;

	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const selectProfilePromise = selectProfileByProfileId(supabase, user.user.id);
	const selectPermissionsPromise = selectPermissionsByProfileIdAndBoardId(
		supabase,
		boardId,
		user.user.id,
	);

	const [selectProfileResponse, selectPermissionsResponse] = await Promise.all([
		selectProfilePromise,
		selectPermissionsPromise,
	]);

	if (selectProfileResponse.error || selectPermissionsResponse.error)
		redirect("/dashboard");

	const updateBoardPromise = updateBoardLastOpenedColumn(supabase, boardId);
	const selectBoardPromise = selectBoardByBoardAndProfileId(
		supabase,
		boardId,
		user.user.id,
	);
	const selectColumnsPromise = selectColumnsByBoardId(supabase, boardId);
	const selectCardsPromise = selectCardsByBoardId(supabase, boardId);
	const selectCollaboratorsPromise = selectCollaboratorsByBoardId(supabase, boardId);

	const [
		updateBoardResponse,
		selectBoardResponse,
		selectColumnsResponse,
		selectCardsResponse,
		selectCollaboratorsResponse,
	] = await Promise.all([
		updateBoardPromise,
		selectBoardPromise,
		selectColumnsPromise,
		selectCardsPromise,
		selectCollaboratorsPromise,
	]);

	if (updateBoardResponse.error) throw updateBoardResponse.error;
	if (selectBoardResponse.error) throw selectBoardResponse.error;
	if (selectColumnsResponse.error) throw selectColumnsResponse.error;
	if (selectCardsResponse.error) throw selectCardsResponse.error;
	if (selectCollaboratorsResponse.error) throw selectCollaboratorsResponse.error;

	const fetchedProfile = selectProfileResponse.data;
	const fetchedPermissions = selectPermissionsResponse.data;
	const fetchedBoard = selectBoardResponse.data;
	const fetchedColumns = selectColumnsResponse.data;
	const fetchedCards = selectCardsResponse.data;
	const fetchedCollaborators = selectCollaboratorsResponse.data;

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<RefreshComponent />
			<BoardHeader
				fetchedProfile={fetchedProfile}
				fetchedPermissions={fetchedPermissions}
				fetchedBoard={fetchedBoard}
				fetchedCollaborators={fetchedCollaborators}
			/>
			<Separator className="w-full" />
			<BoardContent
				boardId={boardId}
				fetchedColumns={fetchedColumns}
				fetchedCards={fetchedCards}
			/>
		</div>
	);
}
