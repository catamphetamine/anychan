import configuration from '../configuration'

export default function getBasePath() {
	if (configuration.basePath) {
		return configuration.basePath
	}
	// `gh-pages` will have `/captchan` base path.
	if (window.location.origin === 'https://catamphetamine.github.io') {
		return window.location.pathname.slice(0, window.location.pathname.indexOf('/', '/'.length))
	}
}