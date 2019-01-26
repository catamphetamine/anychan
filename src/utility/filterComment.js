const IGNORED_WORDS = [
  "пидора[шх].*",
  "пыня",
  "пыни",
  "пыню",
  "коммуняк",
  "хуесос.*",
  "карлан.*",
  "блядски.*",
  "выблядк.*",
  "поебал.*",
  "чмо",
  "рашк.",
  "рашко.*",
  "ебар."
]

const IGNORED_WORDS_CASE_SENSITIVE = [
  "пидора[шх].*",
  "пыня",
  "пыни",
  "пыню",
  "коммуняк",
  "хуесос.*",
  "карлан.*",
  "блядски.*",
  "выблядк.*",
  "поебал.*",
  "чмо",
  "рашка",
  "рашко.*",
  "ебар."
]

const IGNORE_WORDS = new RegExp('^(' + IGNORED_WORDS.join('|') + ')$', 'i')
const IGNORE_WORDS_CASE_SENSITIVE = new RegExp('^(' + IGNORED_WORDS_CASE_SENSITIVE.join('|') + ')$')

/**
 * Returns `false` if the comment doesn't pass the filter.
 * @param  {string} comment
 * @return {boolean}
 */
export default function filterComment(comment) {
	const words = comment.split(/[^а-яА-Я]+/)
	for (const word of words) {
		if (IGNORE_WORDS.test(word) || IGNORE_WORDS_CASE_SENSITIVE.test(word)) {
			return false
		}
	}
	return true
}