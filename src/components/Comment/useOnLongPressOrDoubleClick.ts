import { useCallback } from 'react'

export default function useOnLongPressOrDoubleClick(handler: () => void) {
	const conditionalHandler = useCallback((event: Event) => {
		if (isElementApplicableForLongPressOrDoubleClickAction(event.target as Element)) {
			handler()
		}
	}, [
		handler
	])

	if (handler) {
		return conditionalHandler
	}
}

// Not all DOM elements inside a comment should react to a long press or a double click.
// For example, the application shouldn't attempt to "steal" a long press event
// from a text element or a link element because there're "native" Operating System
// actions associated with long-pressing such elements on mobile devices.
const ELEMENTS_APPLICABLE_FOR_LONG_PRESS_OR_DOUBLE_CLICK_ACTION = [
	'Comment',
	'Comment-thumbnail',
	'Comment-thumbnailPlaceholder',
	'Comment-exceptThumbnail',
	'CommentAuthor',
	'PostTitle',
	'PostParagraph',
	'PostVideo',
	'PostPicture',
	// When there're attachment thumbnails, the empty space between them
	// is `.PostAttachmentThumbnails-list`.
	'PostAttachmentThumbnails-list',
	// When there's very little text in a comment, the empty space in the lower part of it
	// is `.Comment-comment`.
	'Comment-comment',
	'PostEmbeddedAttachmentTitle',
	'PostContent',
	'CommentFooter',
	'CommentFooter-left',
	'CommentFooter-right'
]

function isElementApplicableForLongPressOrDoubleClickAction(element: Element) {
	for (const className of ELEMENTS_APPLICABLE_FOR_LONG_PRESS_OR_DOUBLE_CLICK_ACTION) {
		if (element.classList.contains(className)) {
			return true
		}
	}
}