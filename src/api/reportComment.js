export default async function reportComment({
	dataSource,
	...rest
}) {
	return await dataSource.api.reportComment({
		...rest
	})
}
