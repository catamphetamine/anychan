import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post } from '../PropTypes'
import getMessages from '../messages'

import {
	ContentSection
} from 'webapp-frontend/src/components/ContentSection'

import './ThreadCommentHidden.css'

export default function ThreadCommentHidden({ post, locale, className }) {
	let content = getMessages(locale).hiddenComment
	if (post.hiddenRule) {
		content += ` (${post.hiddenRule})`
	}
	return (
		<ContentSection className={className}>
			{content}
		</ContentSection>
	)
}

ThreadCommentHidden.propTypes = {
	post: post.isRequired,
	locale: PropTypes.string.isRequired,
	className: PropTypes.string
}
