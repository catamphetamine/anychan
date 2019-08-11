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
		getUrl,
		emojiUrl,
		commentUrlRegExp,
		parseContent,
		parseContentForOpeningPost
	}
) {
	const comment = {
		id,
		createdAt
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
		comment.parseContent = NO_OP
	}
	if (rawComment) {
		function parseCommentContent() {
			return parseAndFormatComment(rawComment, {
				censoredWords,
				correctGrammar,
				commentUrlRegExp,
				plugins: parseCommentPlugins,
				// These're used by `postProcessCommentContent`
				comment,
				boardId,
				threadId,
				messages,
				getUrl,
				emojiUrl
			})
		}
		// The "opening" post of a thread is always parsed
		// when showing thread page because it's always immediately visible
		// and also because `title` is autogenerated from it.
		if (parseContent === false && !(id === threadId && parseContentForOpeningPost)) {
			comment.rawContent = rawComment
			comment.parseContent = () => {
				comment.rawContent = undefined
				// `.parseContent()` method is set to a "no op" function
				// instead of `undefined` for convenience.
				// (because it can be called multiple times in case of a
				//  `virtual-scroller` with `initialState` being passed)
				comment.parseContent = () => {}
				comment.content = parseCommentContent()
				if (comment.onContentChange) {
					comment.onContentChange()
				}
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