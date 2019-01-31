import expectToEqual from './expectToEqual'

export default function(correctGrammar) {
	expectToEqual(
		correctGrammar('a,b ,c , d, e -- f - g'),
		'a, b, c, d, e — f — g'
	)

	expectToEqual(
		correctGrammar('раз.Два'),
		'раз. Два'
	)

	expectToEqual(
		correctGrammar('раз(два)'),
		'раз (два)'
	)

	expectToEqual(
		correctGrammar('раз?(два)'),
		'раз? (два)'
	)

	expectToEqual(
		correctGrammar('"раз"(два)'),
		'«раз» (два)'
	)

	expectToEqual(
		correctGrammar('" раз "'),
		'«раз»'
	)
}