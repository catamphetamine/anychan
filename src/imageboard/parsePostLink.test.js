import parsePostLink from './parsePostLink'

import { describe, it } from './utility/mocha'
import expectToEqual from './utility/expectToEqual'

import FourChannel from './chan/4chan/index.json'
import EightChannel from './chan/8ch/index.json'
import TwoChannel from './chan/2ch/index.json'

describe('parsePostLink', () => {
	it('should parse anchor post links', () => {
		expectToEqual(
			parsePostLink('#p12345', {}),
			{
				postId: 12345
			}
		)
	})

	it('should parse relative post links (4chan.org)', () => {
		expectToEqual(
			parsePostLink('/a/thread/184064641#p184154285', { commentUrlParser: FourChannel.commentUrlParser }),
			{
				boardId: 'a',
				threadId: 184064641,
				postId: 184154285
			}
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		expectToEqual(
			parsePostLink('/newsplus/res/238546.html#238584', { commentUrlParser: EightChannel.commentUrlParser }),
			{
				boardId: 'newsplus',
				threadId: 238546,
				postId: 238584
			}
		)
	})

	it('should parse relative post links (2ch.hk)', () => {
		expectToEqual(
			parsePostLink('/b/res/197765456.html#197791215', { commentUrlParser: TwoChannel.commentUrlParser }),
			{
				boardId: 'b',
				threadId: 197765456,
				postId: 197791215
			}
		)
	})
})

