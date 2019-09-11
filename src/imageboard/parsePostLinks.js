import parsePostLink from './parsePostLink'

export default function parsePostLinks(rawContent, { commentUrlParser }) {
	const regExp = / href="(.+?)"/g
	const postLinks = []
	let hrefMatch
	while ((hrefMatch = regExp.exec(rawContent)) !== null) {
		const href = hrefMatch[1]
		const postLink = parsePostLink(href, { commentUrlParser })
		// Exclude duplicates.
		if (postLink && postLinks.indexOf(postLink) < 0) {
			postLinks.push(postLink)
		}
	}
	return postLinks
}