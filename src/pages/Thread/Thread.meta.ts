import type { Thread } from '@/types'
import type { usePageStateSelector as usePageStateSelector_ } from '@/hooks'

export default function getThreadPageMeta({ usePageStateSelector }: { usePageStateSelector: typeof usePageStateSelector_ }) {
	const channel = usePageStateSelector('thread', state => state.thread.channel)
	const thread = usePageStateSelector('thread', state => state.thread.thread)
	return {
		title: thread && ('/' + channel.id + '/' + ' — ' + thread.titleCensored),
		description: thread && thread.comments[0].textPreviewForPageDescription,
		image: thread && getThreadImage(thread)
	}
}

function getThreadImage(thread: Thread) {
	const comment = thread.comments[0]
	if (comment.attachments && comment.attachments.length > 0) {
		for (const attachment of comment.attachments) {
			switch (attachment.type) {
				case 'picture':
					return attachment.picture.url
				case 'video':
					return attachment.video.picture.url
			}
		}
	}
}