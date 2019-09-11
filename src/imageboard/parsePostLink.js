// `4chan.org` thread page:
// `<a href="#p184569592" class="quotelink">&gt;&gt;184569592</a>`
const ANCHOR_LINK_POST_ID_REGEXP = /^#p(\d+)$/

export default function parsePostLink(href, { commentUrlParser }) {
	if (href[0] === '#') {
		// `4chan.org` thread page:
		// `<a href="#p184569592" class="quotelink">&gt;&gt;184569592</a>`
		const match = href.match(ANCHOR_LINK_POST_ID_REGEXP)
		if (match) {
			return {
				postId: parseInt(match[1])
			}
		}
	} else {
		// `4chan.org` board page:
		// `<a href="/a/thread/189127987#p189135882" class="quotelink" style="">&gt;&gt;189135882</a>`
		// `8ch.net` both board page and thread page:
		// `<a onclick="highlightReply('238584', event);" href="/newsplus/res/238546.html#238584">&gt;&gt;238584</a>`
		const match = href.match(commentUrlParser)
		if (match) {
			return {
				boardId: match[1],
				threadId: parseInt(match[2]),
				postId: parseInt(match[3])
			}
		}
	}
}