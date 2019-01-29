import expectToEqual from './expectToEqual'

export default function(correctQuotes) {
	expectToEqual(
		correctQuotes('""'),
		'""'
	)

	expectToEqual(
		correctQuotes('"раз"(два)'),
		'«раз»(два)'
	)

	expectToEqual(
		correctQuotes('" раз "'),
		'«раз»'
	)

	expectToEqual(
		correctQuotes('" раз "два"'),
		'" раз "два"'
	)

	expectToEqual(
		correctQuotes('" раз "два""'),
		'" раз "два""'
	)
}