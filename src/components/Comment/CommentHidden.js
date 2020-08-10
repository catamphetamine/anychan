import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import OnClick from 'webapp-frontend/src/components/OnClick'

import { post } from '../../PropTypes'
import getMessages from '../../messages'

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
		<OnClick
			{...rest}
			onClick={onShow}
			onClickClassName={undefined}>
			{content}
		</OnClick>
	)
}

CommentHidden.propTypes = {
	comment: post.isRequired,
	locale: PropTypes.string.isRequired,
	className: PropTypes.string
}
