import parseAndFormatComment from './parseAndFormatComment'
import censorWords from 'webapp-frontend/src/utility/post/censorWords'

const NO_OP = () => {}

export default function constructComment(
	boardId,
	threadId,
	id,
	rawComment,
	authorName,
	authorRole,
	authorBanned,
	title,
	attachments,
	createdAt,
	{
		censoredWords,
		parseCommentPlugins,
		correctGrammar,
		messages,
		commentUrl,
		emojiUrl,
		toAbsoluteUrl,
		commentUrlParser,
		parseContent
	}
) {
	const comment = {
		id
	}
	// The date on which the comment was posted.
	// All chans except `lynxchan` have this.
	// `lynxchan` doesn't have it which is a bug
	// but seems like they don't want to fix it.
	if (createdAt) {
		comment.createdAt = createdAt
	}
	if (attachments) {
		comment.attachments = attachments
	}
	if (title) {
		if (correctGrammar) {
			title = correctGrammar(title)
		}
		if (title) {
			comment.title = title
			if (censoredWords) {
				const titleCensored = censorWords(title, censoredWords)
				if (titleCensored !== title) {
					comment.titleCensored = titleCensored
				}
			}
		}
	}
	if (parseContent === false) {
		// `.parseContent()` should always be present in case of `parseContent: false`,
		// even when a comment has no content. This is just for convenience.
		// This will be replaced with the real `.parseContent()` function
		// if the comment has any content.
		comment.parseContent = NO_OP
	}
	// Replace the dummy `.parseContent()` function with the real one
	// if the comment has any content.
	if (rawComment) {
		function parseCommentContent() {
			return parseAndFormatComment(rawComment, {
				censoredWords,
				correctGrammar,
				commentUrlParser,
				plugins: parseCommentPlugins,
				// These're used by `postProcessCommentContent`
				comment,
				boardId,
				threadId,
				messages,
				commentUrl,
				emojiUrl,
				toAbsoluteUrl
			})
		}
		if (parseContent === false) {
			comment.rawContent = rawComment
			comment.parseContent = () => {
				comment.rawContent = undefined
				// `.parseContent()` method is set to a "no op" function
				// instead of `undefined` for convenience.
				// (because it can be called multiple times in case of a
				//  `virtual-scroller` with `initialState` being passed)
				comment.parseContent = NO_OP
				comment.content = parseCommentContent()
			}
		} else {
			comment.content = parseCommentContent()
		}
	}
	if (authorName) {
		comment.authorName = authorName
	}
	if (authorRole) {
		comment.authorRole = authorRole
	}
	if (authorBanned) {
		comment.authorBanned = true
		if (typeof authorBanned === 'string') {
			comment.authorBanReason = authorBanned
		}
	}
	return comment
}