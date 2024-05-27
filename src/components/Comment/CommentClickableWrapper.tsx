import type { CommentId, ThreadId, ChannelId } from '@/types'

import React, { ReactNode, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Clickable from 'frontend-lib/components/Clickable.js'

import useUrlBasePath from '../../hooks/useUrlBasePath.js'

import getUrl from '../../utility/getUrl.js'

import {
	commentId,
	threadId,
	channelId
} from '../../PropTypes.js'

import './CommentClickableWrapper.css'

export default function CommentClickableWrapper({
	onClick: onClick_,
	channelId,
	threadId,
	commentId,
	children
}: {
	onClick: (commentId: CommentId, threadId: ThreadId, channelId: ChannelId) => void,
	channelId: ChannelId,
	threadId: ThreadId,
	commentId: CommentId,
	children: ReactNode
}) {
	const urlBasePath = useUrlBasePath()

	const onClick = useCallback((event: Event) => {
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

	const getOnClickUrl = useCallback((channelId: ChannelId, threadId: ThreadId, commentId: CommentId) => {
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
			cursor="pointer"
			filter={commentOnClickFilter}
			onClick={onClick}
			url={urlBasePath + getOnClickUrl(channelId, threadId, commentId)}
			className={classNames('CommentClickableWrapper', {
				'CommentClickableWrapper--rootComment': threadId === commentId
			})}>
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

function commentOnClickFilter(element: Element) {
	if (element.classList.contains('PostInlineSpoiler-contents')) {
		if (element.parentElement.dataset.hide) {
			return false
		}
	}
	if (isInsideOrEqualToClassName(element, 'PostSocial--clickable', 'Clickable')) {
		return false
	}
	return true
}

function isInsideOrEqualToClassName(element: Element | undefined | null, className: string, maxParentClassName: string) {
	if (!element || element.classList.contains(maxParentClassName)) {
		return false
	}
	if (element.classList.contains(className)) {
		return true
	}
	return isInsideOrEqualToClassName(element.parentElement, className, maxParentClassName)
}
