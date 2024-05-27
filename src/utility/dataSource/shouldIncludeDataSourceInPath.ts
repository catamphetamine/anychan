import getDefaultDataSourceId from './getDefaultDataSourceId.js'

export default function shouldIncludeDataSourceInPath() {
	return !getDefaultDataSourceId()
}
