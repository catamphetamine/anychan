import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Clickable from 'frontend-lib/components/Clickable.js'

import { comment } from '../../PropTypes.js'
import getMessages from '../../messages/index.js'

import './CommentHidden.css'

export default function CommentHidden({
	onShow,
	comment,
	locale,
	...rest
}) {
	let content = getMessages(locale).comment.hidden
	if (comment.hiddenRule) {
		content += ` (${comment.hiddenRule})`
	}
	return (
		<Clickable
			{...rest}
			onClick={onShow}
			onClickClassName={undefined}>
			{content}
		</Clickable>
	)
}

CommentHidden.propTypes = {
	comment: comment.isRequired,
	locale: PropTypes.string.isRequired,
	className: PropTypes.string
}
