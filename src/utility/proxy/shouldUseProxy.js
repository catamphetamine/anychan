import isDeployedOnDataSourceDomain from '../dataSource/isDeployedOnDataSourceDomain.js'

export default function shouldUseProxy({ dataSource }) {
	return !isDeployedOnDataSourceDomain(dataSource)
}
