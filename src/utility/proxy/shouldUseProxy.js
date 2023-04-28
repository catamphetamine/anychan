import isDeployedOnDataSourceDomain from '../source/isDeployedOnDataSourceDomain.js'

export default function shouldUseProxy({ dataSource }) {
	return !isDeployedOnDataSourceDomain(dataSource)
}
