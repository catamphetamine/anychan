export default async function vote({
	dataSource,
	...rest
}) {
	return await dataSource.api.vote({
		...rest
	})
}
