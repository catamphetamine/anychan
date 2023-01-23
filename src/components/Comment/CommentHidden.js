import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Clickable from 'frontend-lib/components/Clickable.js'

import { comment } from '../../PropTypes.js'

import './CommentHidden.css'

export default function CommentHidden({
	mode,
	comment,
	messages,
	className,
	...rest
}) {
	let content = mode === 'channel'
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
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: comment.isRequired,
	messages: PropTypes.object.isRequired,
	className: PropTypes.string
}
