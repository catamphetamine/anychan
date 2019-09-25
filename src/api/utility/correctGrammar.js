import { LETTER } from 'social-components/commonjs/utility/post/compileWordPatterns'

import correctQuotes from './correctQuotes'

/**
 * Corrects text grammar (naive implementation).
 * @param  {string} text
 * @return {string}
 */
export default function correctGrammar(text, options = {}) {
	const { language } = options
	const letter = language && LETTER[language] || LETTER.default
	text = text
		// ` -- ` -> ` — ` (converts double dash to long dash)
		.replace(/\s+--\s+/g, ' — ')
		// ` - ` -> ` — ` (converts dash to long dash)
		.replace(/\s+-\s+/g, ' — ')
		// Some people write lists using dashes so turned off this grammar correction rule.
		// // ` - ` -> ` — ` (converts a dash in the beginning of a string to a long dash)
		// .replace(/\n-\s+/g, '\n— ')
		// .replace(/^-\s+/g, '— ')
		// `a- ` -> `a — ` (converts a dash to long dash and adds space)
		.replace(new RegExp(`([${letter}])-\\s+`, 'g'), '$1 — ')
		// `a(a` -> `a (a` (adds a space before an opening parenthesis,
		//                  removes a space after an opening parenthesis)
		.replace(new RegExp(`([${letter}]["\\.!?]?) ?\\( ?([\\d${letter}])`, 'g'), '$1 ($2')
		// `a(a` -> `a (a` (adds a space after a closing parenthesis)
		.replace(new RegExp(`([\\d${letter}][\\."]?)\\)([${letter}])`, 'g'), '$1) $2')
		// `a:a` -> `a: a` (adds a space after a colon)
		.replace(new RegExp(`([${letter}]):([\\d${letter}])`, 'g'), '$1: $2')
		// `one ,two` -> `one,two`
		// `one , two` -> `one, two`
		.replace(/\s+,/g, ',')
		// `one,two` -> `one, two`
		.replace(/,(\S)/g, ', $1')
		// `one ?` -> `one?`
		.replace(/\s+([\.!?])/g, '$1')

	if (letter.indexOf('\\') < 0) {
		const uppercaseLetter = letter.toUpperCase()
		text = text
			// `\n.A` -> `\nА` (removes a comma in the start)
			.replace(new RegExp(`^\\.([${letter.toUpperCase()}])`, 'g'), '$1')
			// `one.Two` -> `one. Two`
			// `one?Two` -> `one? Two`
			// (limited to ASCII because javascript doesn't support Unicode regexps yet)
			.replace(new RegExp(`([${letter}][\\.!?])([${letter.toUpperCase()}][${letter} ])`, 'g'), '$1 $2')
			// `...` -> `…`
			.replace(new RegExp(`([${letter}${letter.toUpperCase()}])\\.\\.\\.`, 'g'), '$1…')
	}

	// `"one"` -> `«one»`
	// (must not preceed other regexps having a quote)
	return correctQuotes(text)
}