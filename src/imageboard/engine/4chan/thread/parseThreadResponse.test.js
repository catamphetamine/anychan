import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import FourChan from '../../../chan/4chan'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new FourChan({
				messages: {
					deletedComment: 'Удалённое сообщение',
					hiddenComment: 'Скрытое сообщение',
					quotedComment: 'Сообщение'
				},
				boardId: 'v',
				threadId: 456354102
			}).parseThread(API_RESPONSE_1),
			RESULT_1
		)
	})
})