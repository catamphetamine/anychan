import ResourceCache from 'webapp-frontend/src/utility/cache/ResourceCache'
import loadResourceLinks from 'social-components/commonjs/utility/post/loadResourceLinks'

import getCommentLengthLimit from './getCommentLengthLimit'
import configuration from '../configuration'

export function loadResourceLinksSync(comment, { mode, messages }) {
	loadResourceLinks(comment, {
		youTubeApiKey: configuration.youtubeApiKey,
		cache: ResourceCache,
		messages: getResourceMessages(messages),
		contentMaxLength: getCommentLengthLimit(mode),
		sync: true
	})
}

export function getResourceMessages(messages) {
	return {
		videoNotFound: messages && messages.post && messages.post.videoNotFound,
		contentType: messages && messages.contentType
	}
}