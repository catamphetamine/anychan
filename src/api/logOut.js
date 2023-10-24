export default async function logOut({
	dataSource,
	...rest
}) {
	return await dataSource.api.logOut({
		...rest
	})
}
