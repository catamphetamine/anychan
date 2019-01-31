import expectToEqual from './expectToEqual'

export default function(getHumanReadableLinkAddress) {
	expectToEqual(
		getHumanReadableLinkAddress('http://youtube.com'),
		'youtube.com'
	)

	expectToEqual(
		getHumanReadableLinkAddress('https://youtube.com'),
		'youtube.com'
	)

	expectToEqual(
		getHumanReadableLinkAddress('https://www.youtube.com'),
		'youtube.com'
	)
}