import type { DataSource } from '@/types'

export default function getDataSourceAbsoluteUrl(
	dataSource: DataSource,
	relativeUrl: string,
	{ notSafeForWork }: Options
) {
	if (dataSource.getAbsoluteUrl) {
		return dataSource.getAbsoluteUrl(relativeUrl, { notSafeForWork })
	}
	return 'https://' + dataSource.domain + relativeUrl
}

interface Options {
	notSafeForWork: boolean;
}