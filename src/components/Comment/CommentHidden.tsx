import type { Comment, Messages } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { comment } from '../../PropTypes.js'

import './CommentHidden.css'

export default function CommentHidden({
	type,
	comment,
	messages,
	className,
	...rest
}: {
	type: 'thread' | 'comment',
	comment: Comment
	messages: Messages
	className?: string
}) {
	let content = type === 'thread'
		? messages.thread.hidden
		: messages.comment.hidden

	// if (comment.hiddenRule) {
	// 	content += ` (${comment.hiddenRule})`
	// }

	return (
		<div
			{...rest}
			className={classNames(className, 'CommentHidden')}>
			{content}
		</div>
	)
}

CommentHidden.propTypes = {
	type: PropTypes.oneOf(['thread', 'comment']).isRequired,
	comment: comment.isRequired,
	messages: PropTypes.object.isRequired,
	className: PropTypes.string
}
