import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'
import Parser from './Parser'

import KohlChan from '../../chan/kohlchan/index.json'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('kohlchan.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			new Parser(KohlChan, {
				messages: {
					deletedComment: 'Удалённое сообщение',
					hiddenComment: 'Скрытое сообщение',
					quotedComment: 'Сообщение'
				},
				getUrl(board, thread, comment) {
					return `/${board.id}/${thread.id}#${comment.id}`
				}
			}).parseThread(API_RESPONSE_1, {
				boardId: 'a'
			}),
			RESULT_1
		)
	})
})