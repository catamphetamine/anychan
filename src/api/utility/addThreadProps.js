import censorWords from 'social-components/utility/post/censorWords.js'
import getInlineContentText from 'social-components/utility/post/getInlineContentText.js'

import transformText from './transformText.js'

export default function addThreadProps(thread, {
	locale,
	grammarCorrection,
	censoredWords
}) {
	// Set `hasAuthorIds` flag on the `thread`.
	if (thread.comments[0].threadHasAuthorIds) {
		thread.hasAuthorIds = true
	}

	// If the thread has a title, then transform it.
	// Otherwise, autogenerate one.
	addThreadTitle(thread, {
		locale,
		grammarCorrection,
		censoredWords
	})
}

function addThreadTitle(thread, {
	locale,
	grammarCorrection,
	censoredWords
}) {
	// If the thread has no title, then use the title
	// generated from the original comment's content.
	if (!thread.title) {
		thread.title = thread.autogeneratedTitle
	}
	// Transform and censor thread title.
	if (thread.title) {
		thread.title = transformText(thread.title, {
			grammarCorrection,
			locale,
			replaceQuotes: true
		})
		if (censoredWords) {
			const titleCensored = censorWords(thread.title, censoredWords)
			if (titleCensored !== thread.title) {
				thread.titleCensoredContent = titleCensored
				thread.titleCensored = getInlineContentText(titleCensored)
			} else {
				thread.titleCensoredContent = thread.title
				thread.titleCensored = thread.title
			}
		}
	} else {
		// Normally, a thread will always have a title,
		// be it a title input by the thread creator,
		// or a one autogenerated from the original comment's
		// content, be it text, picture, video, etc.
		// But just in case anything weird happens,
		// a dummy thread title is added here.
		thread.title = `#${thread.id}`
	}
}