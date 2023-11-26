export const BASE_PREFIX = '⌨️'

export default function getStoragePrefix({
	dataSource,
	multiDataSource
}) {
	return BASE_PREFIX + (multiDataSource ? dataSource.shortId : '')
}