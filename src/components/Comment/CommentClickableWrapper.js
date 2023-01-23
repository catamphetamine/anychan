import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import Clickable from 'frontend-lib/components/Clickable.js'

import getBasePath from '../../utility/getBasePath.js'
import getUrl from '../../utility/getUrl.js'

import {
	commentId,
	threadId,
	channelId
} from '../../PropTypes.js'

export default function CommentClickableWrapper({
	onClick: onClick_,
	channelId,
	threadId,
	commentId,
	children
}) {
	const onClick = useCallback((event) => {
		if (onClick_) {
			event.preventDefault()
			onClick_(commentId, threadId, channelId)
		}
	}, [
		onClick_,
		commentId,
		threadId,
		channelId
	])

	const getOnClickUrl = useCallback((channelId, threadId, commentId) => {
		return getUrl(channelId, threadId, commentId)
	}, [])

	// Not using a `<Link/>` here because "<a> cannot appear as a descendant of <a>".
	// if (!onClick_ && getOnClickUrl) {
	// 	return (
	// 		<Link
	// 			id={id}
	// 			to={getOnClickUrl(channelId, threadId, comment.id)}
	// 			onClickClassName="Comment-container--click"
	// 			className="Comment-container">
	// 			{commentElement}
	// 		</Link>
	// 	)
	// }

	return (
		<Clickable
			filter={commentOnClickFilter}
			onClick={onClick}
			url={getBasePath() + getOnClickUrl(channelId, threadId, commentId)}>
			{children}
		</Clickable>
	)
}

CommentClickableWrapper.propTypes = {
	onClick: PropTypes.func.isRequired,
	commentId: commentId.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	children: PropTypes.node.isRequired
}

function commentOnClickFilter(element) {
	if (element.classList.contains('PostInlineSpoiler-contents')) {
		if (element.parentNode.dataset.hide) {
			return false
		}
	}
	if (isInsideOrEqualToClassName(element, 'PostSocial--clickable', 'Clickable')) {
		return false
	}
	return true
}

function isInsideOrEqualToClassName(element, className, maxParentClassName) {
	if (!element || element.classList.contains(maxParentClassName)) {
		return false
	}
	if (element.classList.contains(className)) {
		return true
	}
	return isInsideOrEqualToClassName(element.parentNode, className, maxParentClassName)
}
