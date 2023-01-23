import { useCallback } from 'react'

export default function useOnLongPressOrDoubleClick(handler) {
	const conditionalHandler = useCallback((event) => {
		if (isElementApplicableForLongPressOrDoubleClickAction(event.target)) {
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
	'CommentAuthor',
	'PostTitle',
	'PostParagraph',
	'PostVideo',
	'PostPicture',
	'PostEmbeddedAttachmentTitle',
	'PostContent',
	'CommentFooter',
	'CommentFooter-left',
	'CommentFooter-right'
]

function isElementApplicableForLongPressOrDoubleClickAction(element) {
	for (const className of ELEMENTS_APPLICABLE_FOR_LONG_PRESS_OR_DOUBLE_CLICK_ACTION) {
		if (element.classList.contains(className)) {
			return true
		}
	}
}