import correctQuotes from '../../../correctQuotes'

/**
 * Corrects text grammar (naive implementation).
 * @param  {string} text
 * @return {string}
 */
export default function correctGrammar(text) {
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
		.replace(/([а-я])-\s+/g, '$1 — ')
		// `a(a` -> `a (a` (adds a space before an opening parenthesis,
		//                  removes a space after an opening parenthesis)
		.replace(/([а-я]["\.!?]?) ?\( ?([\dа-я])/g, '$1 ($2')
		// `a(a` -> `a (a` (adds a space after a closing parenthesis)
		.replace(/([\dа-я][\."]?)\)([а-я])/g, '$1) $2')
		// `a:a` -> `a: a` (adds a space after a colon)
		.replace(/([а-я]):([\dа-я])/g, '$1: $2')
		// `\n.A` -> `\nА` (removes a comma in the start)
		.replace(/^\.([А-Я])/g, '$1')
		// `one ,two` -> `one,two`
		// `one , two` -> `one, two`
		.replace(/\s+,/g, ',')
		// `one,two` -> `one, two`
		.replace(/,(\S)/g, ', $1')
		// `one ?` -> `one?`
		.replace(/\s+([\.!?])/g, '$1')
		// `one.Two` -> `one. Two`
		// `one?Two` -> `one? Two`
		// (limited to ASCII because javascript doesn't support Unicode regexps yet)
		.replace(/([а-я][\.!?])([А-Я][а-я ])/g, '$1 $2')
		// `...` -> `…`
		.replace(/([а-яА-Я])\.\.\./g, '$1…')

	// `"one"` -> `«one»`
	// (must not preceed other regexps having a quote)
	return correctQuotes(text)
}