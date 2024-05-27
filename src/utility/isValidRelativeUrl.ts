export default function isValidRelativeUrl(url: string) {
	return url[0] === '/' && url[1] !== '/'
}