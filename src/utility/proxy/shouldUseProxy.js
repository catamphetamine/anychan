import isDeployedOnProviderDomain from '../source/isDeployedOnProviderDomain.js'

export default function shouldUseProxy({ provider }) {
	return !isDeployedOnProviderDomain(provider)
}
