import type { CommentId } from '@/types'

import React from 'react'

// @ts-expect-error
import { FadeInOut } from 'react-responsive-ui'

import usePageStateSelector from '../../hooks/usePageStateSelector.js'

import { commentId } from '../../PropTypes.js'

import './NewAutoUpdateCommentsStartLine.css'

export default function NewAutoUpdateCommentsStartLine({ commentId }: { commentId: CommentId }) {
	const autoUpdateFirstNewCommentId = usePageStateSelector('thread', state => state.thread.autoUpdateFirstNewCommentId)

	return (
		<FadeInOut
			show={commentId === autoUpdateFirstNewCommentId}
			fadeOutDuration={300}>
			<div className="Comment-newAutoUpdateCommentsStartLine"/>
		</FadeInOut>
	)
}

NewAutoUpdateCommentsStartLine.propTypes = {
	commentId: commentId.isRequired
}