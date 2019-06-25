import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'
import Parser from './Parser'
// import FourChan from '../../chan/4chan'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new Parser('4chan', {
				messages: {
					deletedPost: 'Удалённое сообщение',
					hiddenPost: 'Скрытое сообщение',
					quotedPost: 'Сообщение'
				},
				getUrl(board, thread, comment) {
					return `/${board.id}/${thread.id}#${comment.id}`
				},
				attachmentUrl: 'https://i.4cdn.org/{boardId}/{name}{ext}',
				attachmentThumbnailUrl: 'https://i.4cdn.org/{boardId}/{name}s.jpg',
				commentUrlRegExp: '^\\/(.+?)\\/thread\\/(\\d+)#p(\\d+)$',
				defaultAuthorName: 'Anonymous'
			}).parseThread(API_RESPONSE_1, {
				boardId: 'v'
			}),
			RESULT_1
		)
	})
})