import type { CommentInfoIcon } from './CommentFooter.js'

import PictureIcon from 'frontend-lib/icons/picture-rect-square-outline-thicker.svg'
import PersonIcon from 'frontend-lib/icons/person-outline-no-bottom-border.svg'
import CommentIcon from 'frontend-lib/icons/message-rounded-rect-square-thicker.svg'

const THREAD_INFO_ICONS: CommentInfoIcon[] = [
	{
		name: 'comments-count',
		icon: CommentIcon,
		title: ({ post, messages }) => messages && messages.commentsCount,
		// `.commentsCount` is set on the first comment of a thread
		// as `thread.comments[0].commentsCount = thread.commentsCount`.
		condition: (post) => post.commentsCount > 1,
		content: ({ post }) => post.commentsCount - 1
	},
	// {
	// 	name: 'replies-count',
	// 	icon: ReplyIcon,
	// 	title: ({ post, messages }) => messages && messages.repliesCount,
	// 	condition: (post) => post.replies && post.replies.length > 0,
	// 	content: ({ post }) => post.replies.length
	// },
	{
		name: 'attachments-count-in-comments',
		icon: PictureIcon,
		title: ({ post, messages }) => messages.commentAttachmentsCount,
		// `.commentAttachmentsCount` is set on the first comment of a thread in `addCommentProps.js`:
		// `thread.comments[0].commentAttachmentsCount = thread.commentAttachmentsCount`.
		// condition: (post) => post.attachmentsCount > (post.attachments ? post.attachments.length : 0),
		// content: ({ post }) => post.attachmentsCount - (post.attachments ? post.attachments.length : 0)
		condition: (post) => post.commentAttachmentsCount > 0,
		content: ({ post }) => post.commentAttachmentsCount
	},
	{
		name: 'unique-posters-count',
		icon: PersonIcon,
		title: ({ post, messages }) => messages.uniquePostersCount,
		condition: (post) => post.uniquePostersCount > 0,
		content: ({ post }) => post.uniquePostersCount
	}
]

export default function getThreadInfoIcons() {
	return THREAD_INFO_ICONS
}