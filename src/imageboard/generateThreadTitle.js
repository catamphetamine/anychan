import getPostSummary from 'webapp-frontend/src/utility/post/getPostSummary'
import getPostText from 'webapp-frontend/src/utility/post/getPostText'
import censorWords from 'webapp-frontend/src/utility/post/censorWords'

/**
 * If `thread.title` is missing then either copy it
 * from the first comment's `title` or attempt to
 * autogenerate it from the first comment's `content`.
 * Also applies censorship rules to `thread.title`
 * if it's either already present or autogenerated.
 * @param  {object} thread
 * @param {object} [options]
 */
export default function generateThreadTitle(thread, options = {}) {
	const { censoredWords, messages, parseContent } = options
	if (!thread.title) {
		thread.title = getPostTitle(thread.comments[0], { messages, parseContent })
	}
	if (thread.title && censoredWords) {
		const titleCensored = censorWords(thread.title, censoredWords)
		if (titleCensored !== thread.title) {
			thread.titleCensored = getPostText(titleCensored)
		}
	}
}

function getPostTitle(post, { messages, parseContent }) {
	if (post.title) {
		return post.title
	}
	if (parseContent !== false) {
		const summary = getPostSummary(post.content, post.attachments, {
			messages,
			maxLength: 60,
			stopOnNewLine: true
		})
		if (summary) {
			return summary
		}
	}
}