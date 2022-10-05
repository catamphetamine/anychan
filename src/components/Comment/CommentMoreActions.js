import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import PostMoreActions from 'social-components-react/components/PostMoreActions.js'

import { notify } from '../../redux/notifications.js'
import { copyTextToClipboard, openLinkInNewTab } from 'web-browser-input'

import {
	comment as commentType,
	channelId,
	threadId
} from '../../PropTypes.js'

import getMessages from '../../messages/index.js'
import { getThreadUrl, getCommentUrl } from '../../provider.js'

import './CommentMoreActions.css'

export default function CommentMoreActions({
	channelId,
	channelIsNotSafeForWork,
	threadId,
	comment,
	dispatch,
	locale,
	mode,
	url,
	urlBasePath,
	onReply,
	onDownloadThread
}) {
	const moreActions = useMemo(() => {
		let actions = []

		if (mode === 'thread') {
			actions.push({
				label: getMessages(locale).post.reply,
				onClick: () => onReply()
			})
			actions.push({
				label: getMessages(locale).post.moreActions.copyId,
				onClick: () => copyTextToClipboard('>>' + comment.id)
			})
		}

		actions = actions.concat([
			// "Copy URL".
			{
				label: getMessages(locale).post.moreActions.copyUrl,
				onClick: () => copyTextToClipboard(window.location.origin + urlBasePath + url)
			},

			// "Report".
			{
				label: getMessages(locale).post.moreActions.report,
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
					dispatch(notify(getMessages(locale).notImplemented))
				}
			},

			// "Hide".
			{
				label: getMessages(locale).post.moreActions.hide,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			},

			// "Ignore Author".
			{
				label: getMessages(locale).post.moreActions.ignoreAuthor,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			}
		])

		if (mode === 'thread') {
			// "Show original comment".
			// (redirects to the original provider website)
			actions.push({
				label: getMessages(locale).post.moreActions.showOriginalComment,
				onClick: () => {
					let url
					if (comment.id === threadId) {
						url = getThreadUrl(channelId, threadId, {
							notSafeForWork: channelIsNotSafeForWork
						})
					} else {
						url = getCommentUrl(channelId, threadId, comment.id, {
							notSafeForWork: channelIsNotSafeForWork
						})
					}
					openLinkInNewTab(url)
				}
			})
		}

		if (mode === 'thread') {
			if (comment.id === threadId) {
				// "Download thread".
				actions.push({
					label: getMessages(locale).downloadThread,
					onClick: onDownloadThread
				})
			}
		}

		return actions
	}, [
		dispatch,
		locale,
		channelId,
		channelIsNotSafeForWork,
		threadId,
		comment,
		mode,
		onReply,
		url,
		urlBasePath,
		onDownloadThread
	])

	return (
		<PostMoreActions
			alignment="right"
			title={getMessages(locale).post.moreActions.title}
			toggleComponent={CommentMoreActionsIcon}
			className="CommentMoreActions"
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
	dispatch: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	url: PropTypes.string.isRequired,
	urlBasePath: PropTypes.string.isRequired,
	onReply: PropTypes.func,
	onDownloadThread: PropTypes.func
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