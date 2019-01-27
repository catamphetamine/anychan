/**
 * Returns `false` if the comment doesn't pass the filter.
 * @param  {string} comment
 * @return {boolean}
 */
export default function filterComment(comment, { ignoredWords, ignoredWordsCaseSensitive }) {
  const ignoreWordsRegExp = new RegExp('^(' + ignoredWords.join('|') + ')$', 'i')
  const ignoreWordsCaseSensitiveRegExp = new RegExp('^(' + ignoredWordsCaseSensitive.join('|') + ')$')
	const words = comment.split(/[^а-яА-Я]+/)
	for (const word of words) {
		if (ignoreWordsRegExp.test(word) || ignoreWordsCaseSensitiveRegExp.test(word)) {
			return false
		}
	}
	return true
}