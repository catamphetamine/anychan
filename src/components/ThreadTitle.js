import React from 'react'
import PropTypes from 'prop-types'

import PostInlineContent from 'webapp-frontend/src/components/PostInlineContent'

import {
	thread as threadType
} from '../PropTypes'

export default function ThreadTitle({ thread }) {
	if (thread.titleCensoredContent) {
		return (
			<PostInlineContent>
				{thread.titleCensoredContent}
			</PostInlineContent>
		)
	}
	return thread.title
}

ThreadTitle.propTypes = {
	thread: threadType.isRequired
}