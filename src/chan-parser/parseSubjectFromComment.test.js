import expectToEqual from './expectToEqual'

export default function(parseSubjectFromComment) {
	expectToEqual(
		parseSubjectFromComment('<strong>abc</strong>'),
		{ subject: 'abc', comment: undefined }
	)

	expectToEqual(
		parseSubjectFromComment('<strong>abc</strong><br><br>def'),
		{ subject: 'abc', comment: 'def' }
	)
}