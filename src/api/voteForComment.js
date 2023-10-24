export default async function voteForComment({
	dataSource,
	...rest
}) {
	return await dataSource.api.voteForComment({
		...rest
	})
}
