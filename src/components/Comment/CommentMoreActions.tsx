import type { Comment, ChannelId, ThreadId, Mode, Messages } from '@/types'

import React, { useState, useMemo, RefObject } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import PostMoreActions from 'social-components-react/components/PostMoreActions.js'

import { copyTextToClipboard, openLinkInNewTab } from 'web-browser-input'

import {
	comment as commentType,
	channelId,
	threadId
} from '../../PropTypes.js'

import useDataSource from '../../hooks/useDataSource.js'
import useUserData from '../../hooks/useUserData.js'

import getThreadUrl from '../../utility/dataSource/getThreadUrl.js'
import getCommentUrl from '../../utility/dataSource/getCommentUrl.js'

import DownloadIcon from 'frontend-lib/icons/download-arrow.svg'
import ReportIcon from 'frontend-lib/icons/report.svg'
import CopyLinkIcon from 'frontend-lib/icons/copy-link.svg'
import CopyCommentIdIcon from '../../../assets/images/icons/copy-comment-id.svg'
import ReplyIcon from 'frontend-lib/icons/reply.svg'
import ExternalIcon from 'social-components-react/icons/external.svg'
import EyeStrikethroughIcon from 'frontend-lib/icons/eye-strikethrough.svg'
import PersonIcon from 'frontend-lib/icons/person-outline-thinner-no-bottom-border.svg'
import PersonStrikethroughIcon from 'frontend-lib/icons/person-outline-thinner-no-bottom-border-strikethrough.svg'
import PersonWithMessageBubbleIcon from 'frontend-lib/icons/person-outline-thinner-no-bottom-border-with-message-bubble.svg'
import PersonWithMessageBubbleStrikethroughIcon from 'frontend-lib/icons/person-outline-thinner-no-bottom-border-with-message-bubble-strikethrough.svg'

import './CommentMoreActions.css'

export default function CommentMoreActions({
	channelId,
	channelIsNotSafeForWork,
	threadId,
	comment,
	messages,
	mode,
	url,
	urlBasePath,
	onReply,
	onReport,
	isOwn,
	setOwn,
	onDownloadThread,
	onHide,
	buttonRef
}: CommentMoreActionsProps) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()
	const userData = useUserData()

	const commentId = comment.id

	const [isIgnoredAuthor, setIgnoredAuthor] = useState(comment.authorId ? userData.isIgnoredAuthor(comment.authorId) : false)

	const moreActions = useMemo(() => {
		let actions = []

		const goToOriginalComment = {
			icon: ExternalIcon,
			label: messages.post.moreActions.goToOriginalComment,
			onClick: () => {
				let url
				if (commentId === threadId) {
					url = getThreadUrl(dataSource, {
						channelId,
						threadId,
						notSafeForWork: channelIsNotSafeForWork
					})
				} else {
					url = getCommentUrl(dataSource, {
						channelId,
						threadId,
						commentId,
						notSafeForWork: channelIsNotSafeForWork
					})
				}
				openLinkInNewTab(url)
			}
		}

		const replyToComment = {
			icon: ReplyIcon,
			label: messages.post.reply,
			onClick: () => {
				onReply()
			}
		}

		const copyCommentId = {
			icon: CopyCommentIdIcon,
			label: messages.post.moreActions.copyId,
			onClick: () => {
				copyTextToClipboard('>>' + commentId)
			}
		}

		const copyUrl = {
			icon: CopyLinkIcon,
			label: messages.post.moreActions.copyUrl,
			onClick: () => {
				copyTextToClipboard(window.location.origin + urlBasePath + url)
			}
		}

		const reportComment = {
			icon: ReportIcon,
			label: messages.post.moreActions.report,
			onClick: () => {
				onReport()
			}
		}

		const hideComment = {
			icon: EyeStrikethroughIcon,
			label: messages.post.moreActions.hide,
			onClick: () => {
				onHide()
			}
		}

		const ignoreCommentAuthor = {
			icon: isIgnoredAuthor
				? PersonIcon
				: PersonStrikethroughIcon,
			label: isIgnoredAuthor
				? messages.post.moreActions.unignoreAuthor
				: messages.post.moreActions.ignoreAuthor,
			onClick: () => {
				if (userData.isIgnoredAuthor(comment.authorId)) {
					userData.removeIgnoredAuthor(comment.authorId)
					setIgnoredAuthor(false)
				} else {
					userData.addIgnoredAuthor(comment.authorId)
					setIgnoredAuthor(true)
					if (onHide) {
						onHide()
						// A convenient feature would be it also automatically hiding
						// all the other comments from the now-ignored author in the current thread.
						// But that would mess up `virtual-scroller`'s layout calculations
						// because some of those comments are gonna be off-screen
						// and, as a result, `virtual-scroller`'s would experience a "jump of content"
						// when scrolling up to such comments after ignoring the author.
						// Because of that, the app doesn't automatically hide all the other comments
						// from this author in the current thread.
					}
				}
			}
		}

		// "This is my comment" / "This is not my comment".
		const setCommentOwnershipStatus = {
			icon: isOwn
				? PersonWithMessageBubbleStrikethroughIcon
				: PersonWithMessageBubbleIcon,
			label: isOwn
				? (threadId === commentId ? messages.unmarkAsOwnThread : messages.unmarkAsOwnComment)
				: (threadId === commentId ? messages.markAsOwnThread : messages.markAsOwnComment),
			onClick: () => {
				setOwn(!isOwn)
			}
		}

		// "This is my thread" / "This is not my thread".
		const setThreadOwnershipStatus = {
			icon: isOwn
				? PersonWithMessageBubbleStrikethroughIcon
				: PersonWithMessageBubbleIcon,
			label: isOwn ? messages.unmarkAsOwnThread : messages.markAsOwnThread,
			onClick: () => {
				setOwn(!isOwn)
			}
		}

		const downloadThread = {
			icon: DownloadIcon,
			label: messages.downloadThread,
			onClick: onDownloadThread
		}


		if (mode === 'thread') {
			if (onReply) {
				actions.push(replyToComment)
			}

			// "Go to original comment".
			// (redirects to the original data source website)
			actions.push(goToOriginalComment)
			// Copies ">>" and comment ID into clipboard.
			actions.push(copyCommentId)
		}

		if (url && urlBasePath) {
			actions.push(copyUrl)
		}

		if (onReport) {
			actions.push(reportComment)
		}

		actions.push(hideComment)

		if (comment.authorId) {
			actions.push(ignoreCommentAuthor)
		}

		if (setOwn) {
			if (mode === 'thread') {
				actions.push(setCommentOwnershipStatus)
			} else {
				actions.push(setThreadOwnershipStatus)
			}
		}

		// if (mode === 'thread') {
		// 	if (commentId === threadId) {
		// 		actions.push(downloadThread)
		// 	}
		// }

		return actions
	}, [
		dispatch,
		messages,
		channelId,
		channelIsNotSafeForWork,
		threadId,
		commentId,
		mode,
		onReply,
		onReport,
		url,
		urlBasePath,
		isOwn,
		setOwn,
		isIgnoredAuthor,
		setIgnoredAuthor,
		onDownloadThread
	])

	return (
		<PostMoreActions
			alignment="right"
			title={messages.post.moreActions.title}
			toggleComponent={CommentMoreActionsIcon}
			className="CommentMoreActions"
			buttonRef={buttonRef}
			buttonClassName="CommentMoreActions-button">
			{moreActions}
		</PostMoreActions>
	)
}

CommentMoreActions.propTypes = {
	channelId: channelId.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	threadId: threadId.isRequired,
	comment: commentType.isRequired,
	messages: PropTypes.object.isRequired,
	mode: PropTypes.oneOf(['channel', 'thread']),
	// `url` and `urlBasePath` are used for "Copy original URL" action.
	url: PropTypes.string,
	urlBasePath: PropTypes.string,
	onReply: PropTypes.func,
	onReport: PropTypes.func,
	isOwn: PropTypes.bool,
	setOwn: PropTypes.func,
	onDownloadThread: PropTypes.func,
	onHide: PropTypes.func.isRequired,
	buttonRef: PropTypes.object
}

interface CommentMoreActionsProps {
	channelId: ChannelId,
	channelIsNotSafeForWork?: boolean,
	threadId: ThreadId,
	comment: Comment,
	messages: Messages,
	mode?: Mode,
	url?: string,
	urlBasePath?: string,
	onReply?: () => void,
	onReport?: () => void,
	isOwn?: boolean,
	setOwn?: (isOwn: boolean) => void,
	onDownloadThread?: () => Promise<void>,
	onHide?: () => void,
	buttonRef?: RefObject<HTMLButtonElement>
}

function CommentMoreActionsIcon() {
	return <EllipsisHorizontalIcon className="CommentMoreActionsIcon"/>
}

function EllipsisHorizontalIcon(props: { className?: string }) {
	const radius = 8;
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 100 ${radius * 2}`}>
			<circle fill="currentColor" cy={radius} cx={radius} r={radius}/>
			<circle fill="currentColor" cy={radius} cx="50" r={radius}/>
			<circle fill="currentColor" cy={radius} cx={100 - radius} r={radius}/>
		</svg>
	)
}