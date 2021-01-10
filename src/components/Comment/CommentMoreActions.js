import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import PostMoreActions from 'webapp-frontend/src/components/PostMoreActions'

import { notify } from 'webapp-frontend/src/redux/notifications'
import copyTextToClipboard from 'webapp-frontend/src/utility/clipboard'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import {
	comment as commentType,
	channelId,
	threadId
} from '../../PropTypes'

import getMessages from '../../messages'
import { getThreadUrl, getCommentUrl } from '../../provider'

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
			{
				label: getMessages(locale).post.moreActions.copyUrl,
				onClick: () => copyTextToClipboard(window.location.origin + urlBasePath + url)
			},
			{
				label: getMessages(locale).post.moreActions.report,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			},
			{
				label: getMessages(locale).post.moreActions.hide,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			},
			{
				label: getMessages(locale).post.moreActions.ignoreAuthor,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			}
		])
		if (mode === 'thread') {
			actions.push({
				label: getMessages(locale).post.moreActions.showOriginalComment,
				onClick: () => {
					let url
					if (comment.id === threadId) {
						url = getThreadUrl(channelId, threadId, {
							isNotSafeForWork: channelIsNotSafeForWork
						})
					} else {
						url = getCommentUrl(channelId, threadId, comment.id, {
							isNotSafeForWork: channelIsNotSafeForWork
						})
					}
					openLinkInNewTab(url)
				}
			})
		}
		if (mode === 'thread') {
			if (comment.id === threadId) {
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