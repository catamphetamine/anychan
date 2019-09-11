import parsePostLinks from './parsePostLinks'

import { describe, it } from './utility/mocha'
import expectToEqual from './utility/expectToEqual'

import FourChannel from './chan/4chan/index.json'
import EightChannel from './chan/8ch/index.json'
import TwoChannel from './chan/2ch/index.json'

describe('parsePostLinks', () => {
	it('should parse anchor post links', () => {
		expectToEqual(
			parsePostLinks(
				`
					<a key="value" href="#p184154285">&gt;&gt;184154285</a>
					text
					<a key="value" href="#p123456">&gt;&gt;123456</a>
				`,
				{}
			),
			[
				{
					postId: 184154285,
				},
				{
					postId: 123456
				}
			]
		)
	})

	it('should parse relative post links (4chan.org)', () => {
		expectToEqual(
			parsePostLinks(
				`
					<a key="value" href="/a/thread/184064641#p184154285">&gt;&gt;184154285</a>
					text
					<a key="value" href="/a/thread/184064641#p123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: FourChannel.commentUrlParser }
			),
			[
				{
					boardId: 'a',
					threadId: 184064641,
					postId: 184154285
				},
				{
					boardId: 'a',
					threadId: 184064641,
					postId: 123456
				}
			]
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		expectToEqual(
			parsePostLinks(
				`
					<a key="value" href="/newsplus/res/238546.html#238584">&gt;&gt;238584</a>
					text
					<a key="value" href="/newsplus/res/238546.html#123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: EightChannel.commentUrlParser }
			),
			[
				{
					boardId: 'newsplus',
					threadId: 238546,
					postId: 238584
				},
				{
					boardId: 'newsplus',
					threadId: 238546,
					postId: 123456
				}
			]
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		expectToEqual(
			parsePostLinks(
				`
					<a href="/b/res/197765456.html#197791215" class="post-reply-link" data-thread="197765456" data-num="197791215">&gt;&gt;197791215</a>
					text
					<a href="/b/res/197765456.html#123456" class="post-reply-link" data-thread="197765456" data-num="123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: TwoChannel.commentUrlParser }
			),
			[
				{
					boardId: 'b',
					threadId: 197765456,
					postId: 197791215
				},
				{
					boardId: 'b',
					threadId: 197765456,
					postId: 123456
				}
			]
		)
	})
})

