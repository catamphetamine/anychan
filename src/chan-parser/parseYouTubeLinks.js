import YouTube from 'webapp-frontend/src/utility/video-youtube'

/**
 * Transforms YouTube `link`s by inserting video title as link content,
 * and also attaches a video `attachment` to the `link`.
 * @param  {object} post
 * @param  {object} options — `{ youTubeApiKey }`
 * @return {void}
 */
export default async function parseYouTubeLinks(post, options = {}) {
	const links = findLinks(post.content)
	for (const link of links) {
		const video = await YouTube.parse(link.url, options)
		if (video) {
			link.attachment = {
				type: 'video',
				video
			}
			if (video.title) {
				link.content = video.title
			}
		}
	}
}

function findLinks(part) {
	if (Array.isArray(part)) {
		return part.map(findLinks).reduce((links, _) => links.concat(_), [])
	}
	// Post content can be empty.
	// Or maybe even post part's content.
	if (!part) {
		return []
	}
	if (typeof part === 'string') {
		return []
	}
	if (part.type === 'link') {
		return [part]
	}
	// Recurse into post parts.
	return findLinks(part.content)
}
