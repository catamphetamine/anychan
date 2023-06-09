import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Clickable from 'frontend-lib/components/Clickable.js'

import { comment } from '../../PropTypes.js'

import './CommentHidden.css'

export default function CommentHidden({
	type,
	comment,
	messages,
	className,
	...rest
}) {
	let content = type === 'thread'
		? messages.thread.hidden
		: messages.comment.hidden

	if (comment.hiddenRule) {
		content += ` (${comment.hiddenRule})`
	}

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
