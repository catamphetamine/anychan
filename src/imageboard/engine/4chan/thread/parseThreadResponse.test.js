import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import Chan from '../../../Chan'
import FourChanConfig from '../../../chan/4chan/index.json'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new Chan(FourChanConfig, {
				messages: {
					deletedComment: 'Удалённое сообщение',
					hiddenComment: 'Скрытое сообщение',
					quotedComment: 'Сообщение'
				}
			}).parseThread(API_RESPONSE_1, {
				boardId: 'v'
			}),
			RESULT_1
		)
	})
})