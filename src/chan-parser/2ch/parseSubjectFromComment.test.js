import parseSubjectFromComment from './parseSubjectFromComment'

import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

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