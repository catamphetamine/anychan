import getInReplyToIds from './getInReplyToIds.js'
import insertPostLinks from './insertPostLinks.js'
import getContentForText from './getContentForText.js'

describe('dataSources/example/api/utility/insertPostLinks', () => {
	it('should replace comment ID references with `type: "post-link"` elements', () => {
		const channelId = 'b'
		const threadId = 1

		const text = '>>123text\n\n\nText >>456 fasd\nWord>>789'

		const content = getContentForText(text)

		insertPostLinks({
			content,
			inReplyToIds: getInReplyToIds(text),
			threadId,
			channelId,
			getPostLinkContent: ({ commentId }) => '>>' + String(commentId)
		})

		content.should.deep.equal([
			[
				{
					type: 'post-link',
					content: '>>123',
					meta: {
						channelId,
						threadId,
						commentId: 123
					}
				},
				'text'
			],
			[
				'Text ',
				{
					type: 'post-link',
					content: '>>456',
					meta: {
						channelId,
						threadId,
						commentId: 456
					}
				},
				' fasd',
				'\n',
				'Word',
				{
					type: 'post-link',
					content: '>>789',
					meta: {
						channelId,
						threadId,
						commentId: 789
					}
				}
			]
		])
	})
})