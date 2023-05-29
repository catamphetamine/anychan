import getConfiguration from '../../configuration.js'

export default function getDefaultDataSourceId() {
	if (typeof getConfiguration().dataSource === 'string') {
		return getConfiguration().dataSource
	} else if (typeof getConfiguration().dataSource === 'object') {
		return getConfiguration().dataSource.id
	}
}