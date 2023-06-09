import React, { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import PostMoreActions from 'social-components-react/components/PostMoreActions.js'

import { notify } from '../../redux/notifications.js'
import { copyTextToClipboard, openLinkInNewTab } from 'web-browser-input'

import {
	comment as commentType,
	channelId,
	threadId
} from '../../PropTypes.js'

import useDataSource from '../../hooks/useDataSource.js'
import useUserData from '../../hooks/useUserData.js'

import getMessages from '../../messages/index.js'

import getThreadUrl from '../../utility/dataSource/getThreadUrl.js'
import getCommentUrl from '../../utility/dataSource/getCommentUrl.js'

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
	onDownloadThread,
	onHide,
	buttonRef
}) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()
	const userData = useUserData()

	const commentId = comment.id

	const isOwn = useCallback(() => {
		if (mode === 'thread') {
			return userData.isOwnComment(channelId, threadId, commentId)
		} else {
			return userData.isOwnThread(channelId, threadId)
		}
	}, [
		mode,
		userData,
		channelId,
		threadId,
		commentId
	])

	const [markedAsOwn, setMarkedAsOwn] = useState(isOwn())
	const [isIgnoredAuthor, setIgnoredAuthor] = useState(comment.authorId ? userData.isIgnoredAuthor(comment.authorId) : false)

	const moreActions = useMemo(() => {
		let actions = []

		if (mode === 'thread') {
			if (onReply) {
				actions.push({
					label: messages.post.reply,
					onClick: () => onReply()
				})
			}
			actions.push({
				label: messages.post.moreActions.copyId,
				onClick: () => copyTextToClipboard('>>' + commentId)
			})
		}

		if (url && urlBasePath) {
			actions.push(
				// "Copy URL".
				{
					label: messages.post.moreActions.copyUrl,
					onClick: () => copyTextToClipboard(window.location.origin + urlBasePath + url)
				}
			)
		}

		actions = actions.concat([
			// "Report".
			{
				label: messages.post.moreActions.report,
				onClick: () => {
					// 4chan.org:
					// const width = 400
					// const height = 550
					// const url = `https://sys.4chan.org/${boardId}/imgboard.php?mode=report&no=${commentId}`
					// return window.open(
					// 	url,
					// 	undefined,
					// 	`toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,width=${width},height=${height}`
					// )
					dispatch(notify(messages.notImplemented))
				}
			},

			// "Hide".
			{
				label: messages.post.moreActions.hide,
				onClick: () => {
					onHide()
				}
			}
		])

		console.log('@@@@@@@@@@@@', isIgnoredAuthor)

		if (comment.authorId) {
			// "Ignore Author".
			actions.push({
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
					}
					dispatch(notify(messages.notImplemented))
				}
			})
		}

		if (mode === 'thread') {
			// "Show original comment".
			// (redirects to the original data source website)
			actions.push({
				label: messages.post.moreActions.showOriginalComment,
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
			})
		}

		if (mode === 'thread') {
			// "This is my comment" / "This is not my comment".
			actions.push({
				label: isOwn()
					? (threadId === commentId ? messages.unmarkAsOwnThread : messages.unmarkAsOwnComment)
					: (threadId === commentId ? messages.markAsOwnThread : messages.markAsOwnComment),
				onClick: () => {
					if (isOwn()) {
						userData.removeOwnComment(channelId, threadId, commentId)
						if (threadId === commentId) {
							userData.removeOwnThread(channelId, threadId)
						}
						setMarkedAsOwn(false)
					} else {
						userData.addOwnComment(channelId, threadId, commentId)
						if (threadId === commentId) {
							userData.addOwnThread(channelId, threadId)
						}
						setMarkedAsOwn(true)
					}
				}
			})
		} else {
			// "This is my thread" / "This is not my thread".
			actions.push({
				label: isOwn() ? messages.unmarkAsOwnThread : messages.markAsOwnThread,
				onClick: () => {
					if (isOwn()) {
						userData.removeOwnThread(channelId, threadId)
						setMarkedAsOwn(false)
					} else {
						userData.addOwnThread(channelId, threadId)
						setMarkedAsOwn(true)
					}
				}
			})
		}

		if (mode === 'thread') {
			if (commentId === threadId) {
				// "Download thread".
				actions.push({
					label: messages.downloadThread,
					onClick: onDownloadThread
				})
			}
		}

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
		url,
		urlBasePath,
		isOwn,
		markedAsOwn,
		setMarkedAsOwn,
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
	onDownloadThread: PropTypes.func,
	onHide: PropTypes.func.isRequired,
	buttonRef: PropTypes.object
}

function CommentMoreActionsIcon() {
	return <EllipsisHorizontalIcon className="CommentMoreActionsIcon"/>
}

function EllipsisHorizontalIcon(props) {
	const radius = 8;
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 100 ${radius * 2}`}>
			<circle fill="currentColor" cy={radius} cx={radius} r={radius}/>
			<circle fill="currentColor" cy={radius} cx="50" r={radius}/>
			<circle fill="currentColor" cy={radius} cx={100 - radius} r={radius}/>
		</svg>
	)
}