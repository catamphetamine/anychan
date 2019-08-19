export default function formatUrl(url, parameters, absoluteUrlPrefix) {
	if (!url) {
		return toAbsoluteUrl(parameters.url, absoluteUrlPrefix)
	}
	for (const parameterName of Object.keys(parameters)) {
		url = url.replace('{' + parameterName + '}', parameters[parameterName])
	}
	return url
}

function toAbsoluteUrl(url, absoluteUrlPrefix) {
	if (url[0] === '/' && url[1] !== '/') {
		if (absoluteUrlPrefix) {
			return absoluteUrlPrefix + url
		}
	}
	return url
}