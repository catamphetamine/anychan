import getConfiguration from '../../getConfiguration.ts'

export default function getDefaultDataSourceId() {
	if (typeof getConfiguration().dataSource === 'string') {
		return getConfiguration().dataSource
	} else if (typeof getConfiguration().dataSource === 'object') {
		return getConfiguration().dataSource.id
	}
}