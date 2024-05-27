import type { Thread } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import PostInlineContent from 'social-components-react/components/PostInlineContent.js'

import {
	thread as threadType
} from '../PropTypes.js'

export default function ThreadTitle({ thread }: ThreadTitleProps) {
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

interface ThreadTitleProps {
	thread: Thread
}