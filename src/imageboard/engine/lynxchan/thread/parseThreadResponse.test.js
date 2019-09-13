import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import KohlChan from '../../../chan/kohlchan'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('kohlchan.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			new KohlChan({
				messages: {
					deletedComment: 'Удалённое сообщение',
					hiddenComment: 'Скрытое сообщение',
					quotedComment: 'Сообщение'
				}
			}).parseThread(API_RESPONSE_1, {
				boardId: 'a'
			}),
			RESULT_1
		)
	})
})