export default function isValidRelativeUrl(url) {
	return url[0] === '/' && url[1] !== '/'
}