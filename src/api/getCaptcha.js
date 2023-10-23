export default async function getCaptcha({
	dataSource,
	...rest
}) {
	return await dataSource.api.getCaptcha({
		dataSource,
		...rest
	})
}
