export default async function Page({
	params,
}: {
	params: Promise<{ board: string }>
}) {
	const board = (await params).board

	return <p>Something about {board}</p>
}
