import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'
import Parser from './Parser'

import KohlChan from '../../chan/kohlchan/index.json'

describe('kohlchan.net', () => {
	it('should parse threads', () => {
		const API_RESPONSE = [{
			"message": "Wir sind das WHQ!\r\nDie halbe N/a/tion\r\nkennt uns schon",
			"markdown": "Wir sind das WHQ!<br/>Die halbe N/a/tion<br/>kennt uns schon",
			"threadId": 297,
			"postCount": 181,
			"fileCount": 161,
			"page": 1,
			"subject": "Gemeinsames Animuschauen",
			"locked": false,
			"pinned": true,
			"cyclic": false,
			"autoSage": false,
			"lastBump": "2019-07-01T18:28:14.680Z",
			"thumb": "https://kohlchan.net/.media/t_82b9c3a866f6233f1c0253d3eb819ea5-imagepng"
		}]

		const THREADS = [{
			id: 297,
			boardId: "a",
			commentsCount: 181,
			commentAttachmentsCount: 161,
			subject: "Gemeinsames Animuschauen",
			isSticky: true,
			lastModifiedAt: new Date("2019-07-01T18:28:14.680Z"),
			comments: [{
				content: [
					[
						'Wir sind das WHQ!',
						'\n',
						'Die halbe N/a/tion',
						'\n',
						'kennt uns schon'
					]
				],
				id: 297,
				createdAt: new Date(0),
				title: "Gemeinsames Animuschauen",
				attachments: [{
					type: 'picture',
					picture: {
						type: 'image/png',
						width: 200,
						height: 200,
						url: 'https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng.png',
            sizes: [{
              "height": 200,
              "type": "image/png",
              "url": "https://kohlchan.net/.media/t_82b9c3a866f6233f1c0253d3eb819ea5-imagepng",
              "width": 200
            }]
					}
				}]
			}]
		}]

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
			}).parseThreads(API_RESPONSE, {
				boardId: 'a'
			}),
			THREADS
		)
	})
})