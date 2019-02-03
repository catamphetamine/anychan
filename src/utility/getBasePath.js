// `gh-pages` will have `/chanchan` base path.
export default function getBasePath() {
	if (window.location.origin === 'https://catamphetamine.github.io') {
		return window.location.pathname.slice(0, window.location.pathname.indexOf('/', '/'.length))
	}
}