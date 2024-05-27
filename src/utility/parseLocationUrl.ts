// Parses a URL into a location object.
// Doesn't construct a `query` object, only returns a `search: string` property.
export default function parseLocationUrl(url: string) {
	let origin
	let pathname

	if (url === '') {
		pathname = '/'
	} else if (url[0] === '/') {
		pathname = url
	} else {
		const pathnameStartsAt = url.indexOf('/', url.indexOf('//') + '//'.length)

		if (pathnameStartsAt > 0) {
			origin = url.slice(0, pathnameStartsAt)
			pathname = url.slice(pathnameStartsAt)
		} else {
			origin = url
			pathname = '/'
		}
	}

	let search = ''
	let hash = ''

	const searchIndex = pathname.indexOf('?')
	if (searchIndex >= 0) {
		search = pathname.slice(searchIndex)
		pathname = pathname.slice(0, searchIndex)
	}

	const hashIndex = search.indexOf('#')
	if (hashIndex >= 0) {
		hash = search.slice(hashIndex)
		search = search.slice(0, hashIndex)
	}

	return { origin, pathname, search, hash }
}
