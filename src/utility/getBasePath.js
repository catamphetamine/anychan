import configuration from '../configuration'
import { shouldIncludeChanInPath, getNonDefaultChanId, addChanToPath } from '../chan'

/**
 * Returns "base" path of the application.
 * For example, on `catamphetamine.github.io/captchan`
 * the "base" path is "/captchan".
 * @return {string}
 */
export default function getBasePath() {
	const basePath = _getBasePath() || ''
	if (shouldIncludeChanInPath() && getNonDefaultChanId()) {
		return addBasePath(addChanToPath('', getNonDefaultChanId()))
	}
	return basePath
}

export function addBasePath(path) {
	const basePath = _getBasePath()
	if (basePath) {
		return basePath + path
	}
	return path
}

export function removeBasePath(path) {
	const basePath = _getBasePath()
	if (basePath) {
		if (path.indexOf(basePath) === 0) {
			return path.slice(basePath.length)
		}
	}
	return path
}

function _getBasePath() {
	if (configuration.basePath) {
		return configuration.basePath
	}
	if (typeof window !== 'undefined') {
		// // `gh-pages` will have `/captchan` base path.
		// if (window.location.origin === 'https://catamphetamine.github.io') {
		// 	return window.location.pathname.slice(0, window.location.pathname.indexOf('/', '/'.length))
		// }
		// `/captchan` is the conventional base path that can be autodetected.
		if (window.location.pathname.indexOf('/captchan') === 0) {
			return '/captchan'
		}
	}
}