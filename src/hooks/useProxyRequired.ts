import shouldUseProxy from '../utility/proxy/shouldUseProxy.js'

import useDataSource from './useDataSource.js'

export default function useProxyRequired() {
	const dataSource = useDataSource()
	return shouldUseProxy({ dataSource })
}