export default async function createComment({
	dataSource,
	...rest
}) {
	return await dataSource.api.createComment({
		...rest
	})
}
