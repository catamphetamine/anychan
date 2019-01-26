import expectToEqual from './expectToEqual'

export default function(getInReplyToPosts) {
	expectToEqual(
		getInReplyToPosts("<a href=\"/test/res/30972.html#100453\" class=\"post-reply-link\" data-thread=\"30972\" data-num=\"100453\">>>100453</a><br><a href=\"/test/res/30972.html#100454\" class=\"post-reply-link\" data-thread=\"30972\" data-num=\"100454\">>>100454</a><br><br>test"),
		[{
			threadId: '30972',
			postId: '100453'
		}, {
			threadId: '30972',
			postId: '100454'
		}]
	)
}