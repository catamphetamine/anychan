import unescapeContent from './unescapeContent'
import filterComment from './filterComment'
import parseCommentText from './parseCommentText'
import postProcessComment from './postProcessComment'

export default async function constructComment(
	boardId,
	threadId,
	id,
	rawComment,
	author,
	subject,
	attachments,
	timestamp,
	{
		filters,
		parseCommentTextPlugins,
		getInReplyToPosts,
		correctGrammar,
		youTubeApiKey,
		messages
	}
) {
	const comment = {
		id,
		inReplyTo: rawComment ? getInReplyToPosts(rawComment, { threadId }) : [],
		attachments,
		createdAt: new Date(timestamp * 1000)
	}
	if (subject) {
		comment.title = unescapeContent(subject)
		if (correctGrammar) {
			comment.title = correctGrammar(comment.title)
		}
	}
	if (rawComment) {
		comment.content = parseCommentText(rawComment, {
			correctGrammar,
			plugins: parseCommentTextPlugins
		})
		if (filters) {
			const result = filterComment(rawComment, filters)
			if (result) {
				comment.hidden = true
				if (result.name !== '*') {
					comment.hiddenRule = result.name
				}
			}
		}
	}
	if (author) {
		comment.author = author
	}
	await postProcessComment(comment, {
		threadId,
		filters,
		messages,
		youTubeApiKey
	})
	return comment
}
