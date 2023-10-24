export default async function report({
	dataSource,
	...rest
}) {
	return await dataSource.api.report({
		...rest
	})
}
