import configuration from '../configuration'

export default function getBasePath() {
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