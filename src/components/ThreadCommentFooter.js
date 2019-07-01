import PictureIcon from 'webapp-frontend/assets/images/icons/picture.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'

import { isMiddleDialogueChainLink } from 'webapp-frontend/src/components/CommentTree'
import { CommentsCountBadge, RepliesCountBadge } from 'webapp-frontend/src/components/Post.badges'

import getMessages from '../messages'

export function getFooterBadges(comment, {
	parentComment,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef
}) {
	// Add "show/hide replies" toggle button.
	let footerBadges = FOOTER_BADGES
	if (comment.replies && !(parentComment && isMiddleDialogueChainLink(comment, parentComment))) {
		footerBadges = footerBadges.concat({
			...RepliesCountBadge,
			isPushed: showingReplies,
			onClick: onToggleShowReplies,
			ref: toggleShowRepliesButtonRef
		})
	}
	return footerBadges
}

const FOOTER_BADGES = [
	CommentsCountBadge,
	{
		name: 'comment-attachments-count',
		icon: PictureIcon,
		title: (post, locale) => getMessages(locale).post.commentAttachmentsCount,
		condition: (post) => post.commentAttachmentsCount,
		content: post => post.commentAttachmentsCount
	},
	{
		name: 'unique-posters-count',
		icon: PersonIcon,
		title: (post, locale) => getMessages(locale).post.uniquePostersCount,
		condition: (post) => post.uniquePostersCount,
		content: post => post.uniquePostersCount
	}
]