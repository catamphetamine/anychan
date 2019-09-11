import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import Chan from '../../../Chan'
import KohlChanConfig from '../../../chan/kohlchan/index.json'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('kohlchan.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			new Chan(KohlChanConfig, {
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