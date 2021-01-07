import React from 'react'
import { useSelector } from 'react-redux'

import { FadeInOut } from 'react-responsive-ui'

import { commentId } from '../../PropTypes'

import './NewAutoUpdateCommentsStartLine.css'

export default function NewAutoUpdateCommentsStartLine({ commentId }) {
	const firstNewAutoUpdateCommentId = useSelector(({ data }) => {
		return data.firstNewAutoUpdateCommentId
	})
	return (
		<FadeInOut
			show={commentId === firstNewAutoUpdateCommentId}
			fadeOutDuration={300}>
			<div className="Comment-newAutoUpdateCommentsStartLine"/>
		</FadeInOut>
	)
}

NewAutoUpdateCommentsStartLine.propTypes = {
	commentId: commentId.isRequired
}