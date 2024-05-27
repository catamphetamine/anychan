import type { DataSource } from '@/types'

/**
 * Adds HTTP origin to a possibly relative URL.
 */
export default function getAbsoluteUrl(url: string, { dataSource }: { dataSource: DataSource }) {
	const isRelativeUrl = url[0] === '/' && url[1] !== '/'
	if (isRelativeUrl) {
		return `https://${dataSource.domain}${url}`
	}
	return url
}