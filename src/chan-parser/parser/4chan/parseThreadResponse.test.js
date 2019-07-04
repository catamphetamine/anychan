import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'
import Parser from './Parser'

import FourChannel from '../../chan/4chan/index.json'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new Parser(FourChannel, {
				messages: {
					deletedPost: 'Удалённое сообщение',
					hiddenPost: 'Скрытое сообщение',
					quotedPost: 'Сообщение'
				},
				getUrl(board, thread, comment) {
					return `/${board.id}/${thread.id}#${comment.id}`
				}
			}).parseThread(API_RESPONSE_1, {
				boardId: 'v'
			}),
			RESULT_1
		)
	})
})