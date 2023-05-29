import isDeployedOnDataSourceDomain from './isDeployedOnDataSourceDomain.js'
import getDataSource from './getDataSource.js'

/**
 * Adds HTTP origin to a possibly relative URL.
 * For example, if this application is deployed on 2ch.hk domain
 * then there's no need to query `https://2ch.hk/...` URLs
 * and instead relative URLs `/...` should be queried.
 * This function checks whether the application should use
 * relative URLs and transforms the URL accordingly.
 */
export default function getAbsoluteUrl(url) {
	if (url[0] === '/' && url[1] !== '/') {
		if (!isDeployedOnDataSourceDomain(getDataSource())) {
			return `https://${getDataSource().domain}${url}`
		}
	}
	return url
}