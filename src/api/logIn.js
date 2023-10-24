export default async function logIn({
	dataSource,
	...rest
}) {
	return await dataSource.api.logIn({
		...rest
	})
}
