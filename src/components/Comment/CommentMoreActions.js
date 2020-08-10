import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import PostMoreActions from 'webapp-frontend/src/components/PostMoreActions'

import { notify } from 'webapp-frontend/src/redux/notifications'
import copyTextToClipboard from 'webapp-frontend/src/utility/clipboard'

import {
	comment as commentType,
	thread as threadType,
	board as boardType
} from '../../PropTypes'

import getMessages from '../../messages'

import './CommentMoreActions.css'

export default function CommentMoreActions({
	board,
	thread,
	comment,
	dispatch,
	locale,
	mode,
	onReply,
	urlBasePath,
	url
}) {
	const moreActions = useMemo(() => {
		const actions = []
		if (mode === 'thread') {
			actions.push({
				label: getMessages(locale).post.reply,
				onClick: onReply
			})
			actions.push({
				label: getMessages(locale).post.moreActions.copyId,
				onClick: () => {
					copyTextToClipboard(comment.id)
				}
			})
		}
		return actions.concat([
			{
				label: getMessages(locale).post.moreActions.copyUrl,
				onClick: () => {
					copyTextToClipboard(urlBasePath + url)
				}
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
	}, [
		dispatch,
		locale,
		board,
		thread,
		comment,
		mode,
		onReply,
		url,
		urlBasePath
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
	board: boardType.isRequired,
	thread: threadType.isRequired,
	comment: commentType.isRequired,
	dispatch: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	onReply: PropTypes.func,
	urlBasePath: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired
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