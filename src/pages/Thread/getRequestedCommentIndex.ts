import type { Thread } from '@/types'
import type { Location } from 'react-pages'

import findIndexByIdOrClosestPreviousOne from '../../utility/findIndexByIdOrClosestPreviousOne.js'

/**
 * Get the index of the requested comment.
 * @param  {object} thread
 * @param  {object} location
 * @return {number} [i]
 */
export default function getRequestedCommentIndex(thread: Thread, location: Location) {
	// If specific comment id is specified in URL after "#",
	// then show comments starting from that comment.
	if (location.hash) {
		const commentId = parseInt(location.hash.slice('#'.length))
		const replaceLocationHash = (newHash = '') => replacePageUrl(location.href.replace(/#.*/, newHash))
		if (isNaN(commentId)) {
			replaceLocationHash()
		} else {
			const index = findIndexByIdOrClosestPreviousOne(thread.comments, commentId)
			if (index === undefined) {
				replaceLocationHash()
			} else {
				const showFromCommentId = thread.comments[index].id
				if (showFromCommentId !== commentId) {
					replaceLocationHash(showFromCommentId === thread.id ? undefined : '#' + showFromCommentId)
				}
				return index
			}
		}
	}
}

// Replaces the current web browser page's URL without reloading the page.
function replacePageUrl(newUrl: string) {
	// https://stackoverflow.com/questions/824349/how-do-i-modify-the-url-without-reloading-the-page
	window.history.replaceState(null, document.title, newUrl)
}