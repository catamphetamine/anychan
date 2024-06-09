import type { DataSource } from '@/types'

export default function getDataSourceAbsoluteUrl(
	dataSource: DataSource,
	relativeUrl: string,
	{ channelContainsExplicitContent }: { channelContainsExplicitContent: boolean }
) {
	if (dataSource.getAbsoluteUrl) {
		return dataSource.getAbsoluteUrl(relativeUrl, { channelContainsExplicitContent })
	}
	return 'https://' + dataSource.domain + relativeUrl
}