export default async function createThread({
	dataSource,
	...rest
}) {
	return await dataSource.api.createThread({
		dataSource,
		...rest
	})
}
