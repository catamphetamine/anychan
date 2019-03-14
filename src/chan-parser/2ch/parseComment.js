import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'
import getInReplyToPosts from './getInReplyToPosts'
import correctGrammar from './correctGrammar'

import constructComment from '../constructComment'

// Фраза "Абу благословил этот пост" добавляется в конец поста
// если этот пост отправлен с использованием "пасс-кода"
// и содержит слово "Спасибо" (с большой буквы).
// Видимо, это задумывалось как способ идентификации автором поста
// себя как "пасскодобоярина" (то есть, чтобы козырнуть своим статусом).
const ABU_LIKE = /<br><br><span class="thanks-abu" style="color: red;">Абу благословил этот пост\.<\/span>$/

/**
 * Parses response thread JSON object.
 * @param  {object} thread — Response thread JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	boardId,
	defaultAuthorName,
	filters,
	parseCommentPlugins,
	messages,
	getUrl
}) {
	let subject = post.subject
	// `post.comment` is always present, even when there's no text.
	let rawComment = post.comment
	// Remove "Абу благословил этот пост" footer.
	let abuLike = false
	if (ABU_LIKE.test(rawComment)) {
		abuLike = true
		rawComment = rawComment.replace(ABU_LIKE, '')
	}
	const id = parseInt(post.num)
	const threadId = parseInt(post.parent)
	const isOpeningPost = threadId === 0
	// Detect `subject` being autogenerated from `comment`.
	// (for example, on `/b/` and `/rf/` boards)
	// If the `subject` is autogenerated then ignore it.
	if (subject && isOpeningPost) {
		if (isAutogeneratedSubject(subject, rawComment)) {
			subject = undefined
		}
	}
	const comment = constructComment(
		boardId,
		isOpeningPost ? id : threadId, // `threadId`.
		id,
		rawComment,
		parseAuthor(post.name, defaultAuthorName),
		parseRole(post.trip),
		post.banned === 1,
		subject,
		post.files.map(parseAttachment),
		post.timestamp,
		{
			filters,
			parseCommentPlugins,
			getInReplyToPosts,
			correctGrammar,
			messages,
			getUrl
		}
	)
	if (abuLike) {
		comment.abuLike = true
	}
	return comment
}

/**
 * This is a reverse-engineered guess of
 * 2ch.hk's subject autogeneration algorithm.
 * For example, it's used in `/b/` and `/rf/`.
 * @param  {string}  subject
 * @param  {string}  comment
 * @return {Boolean}
 */
function isAutogeneratedSubject(subject, comment) {
	const commentText = comment.replace(/<br>/g, ' ').replace(/<.+?>/g, '')
	return commentText.indexOf(subject) === 0
}

function parseRole(tripCode) {
	switch (tripCode) {
		case '!!%adm%!!':
			return 'administrator'
		case '!!%mod%!!':
			return 'moderator'
		default:
			// Users can have their own trip codes.
			// Example: "!!5pvF7WEJc."
	}
}