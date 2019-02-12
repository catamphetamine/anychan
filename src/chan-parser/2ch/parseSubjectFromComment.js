/**
 * Parses subject from comment start.
 * @param  {string} comment
 * @return {object} [result] `{ subject: string, [comment]: string }`
 */
export default function parseSubjectFromComment(comment) {
	const match = comment.match(/^<strong>(?:<em>)?([^<]+)(?:<br>)?(?:<\/em>)?<\/strong>(?:(?:<br><br>)(.+))?$/)
	if (match) {
		return {
			subject: match[1],
			comment: match[2]
		}
	}
}