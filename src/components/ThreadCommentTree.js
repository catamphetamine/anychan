import React from 'react'

import CommentTree from 'webapp-frontend/src/components/CommentTree'
import ThreadComment from './ThreadComment'

import './ThreadCommentTree.css'

export default function ThreadCommentTree(props) {
	return (
		<CommentTree
			{...props}
			component={ThreadComment}/>
	)
}