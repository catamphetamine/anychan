import { LETTER } from 'social-components/utility/post/compileWordPatterns.js'

// Doesn't support transforming: "Раз.Два" -> "Раз. Два".
// // https://github.com/typograf/typograf
// // https://typograf.github.io/
// import Typograf from 'typograf'

/**
 * Corrects text grammar (naive implementation).
 * @param  {string} text
 * @param  {string} [options.language]
 * @return {string}
 */
export default function correctGrammar(text, {
	language
}) {
	// Doesn't support transforming: "Раз.Два" -> "Раз. Два".
	// // https://github.com/typograf/typograf
	// // https://typograf.github.io/
	// if (language === 'ru') {
	// 	const typograf = new Typograf({ locale: language })
	// 	return typograf.execute(text)
	// }

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
		// `a(a` -> `a (a`
		// `( a` -> `(a`   (adds a space before an opening parenthesis,
		//                  removes a space after an opening parenthesis)
		.replace(new RegExp(`([${letter}]["\\.!?]?) ?\\( ?([\\d${letter}])`, 'g'), '$1 ($2')
		// `a)a` -> `a) a` (adds a space after a closing parenthesis)
		.replace(new RegExp(`([\\d${letter}][\\."]?)\\)([${letter}])`, 'g'), '$1) $2')
		// // `a ) ` -> `a) ` (removes a space before a closing parenthesis)
		// .replace(new RegExp(`([${letter}]) \\) `, 'g'), '$1) ')
		// `a:a` -> `a: a` (adds a space after a colon)
		.replace(new RegExp(`([${letter}]):([\\d${letter}])`, 'g'), '$1: $2')
		// `one ,two` -> `one,two`
		// `one , two` -> `one, two`
		.replace(/\s+,/g, ',')
		// `one,  two` -> `one, two`
		.replace(/,\s\s+/g, ', ')
		// // `one,two` -> `one, two`
		// .replace(new RegExp(`([${letter}]),([${letter}])`, 'g'), '$1, $2')
		// `one,two` -> `one, two`
		// Restricts the "next" part to a letter or a digit,
		// rather than simply inserting a space after every comma,
		// because there could be intentional spaceless cases
		// like, for example, "abc,./:*".
		.replace(new RegExp(`,([\\d${letter}])`, 'g'), ', $1')
		// `one ?` -> `one?`
		.replace(/\s+([\.!?])/g, '$1')

	// If `LETTER[language]` is defined (not a broad "generic" one),
	// then correct sentence end/start punctuation.
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
	return text
}