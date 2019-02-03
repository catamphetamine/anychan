import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import parseSubjectFromComment from './parseSubjectFromComment'

describe('parseSubjectFromComment', () => {
	it('should parse subject from comment', () => {
		expectToEqual(
			parseSubjectFromComment('<strong>abc</strong>'),
			{ subject: 'abc', comment: undefined }
		)

		expectToEqual(
			parseSubjectFromComment('<strong>abc</strong><br><br>def'),
			{ subject: 'abc', comment: 'def' }
		)
	})
})