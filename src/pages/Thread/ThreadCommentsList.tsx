import type { GetCommentById, Thread, Comment, Props } from '@/types'
import type { ItemComponentVirtualScrollerProps } from 'virtual-scroller/react'

import React from 'react'
import PropTypes from 'prop-types'

import {
	setVirtualScrollerState
} from '../../redux/threadPage.js'

import ThreadComment from './ThreadComment.js'
import { CommentsListOnThreadPage as CommentsList } from '../../components/CommentsList.js'

import { usePageStateSelector } from '@/hooks'

import { thread, comment } from '../../PropTypes.js'

export default function ThreadCommentsList({
	thread,
	shownComments,
	getCommentById,
	...rest
}: ThreadCommentsListProps) {
	const initialVirtualScrollerState = usePageStateSelector('threadPage', state => state.threadPage.virtualScrollerState)

	if (shownComments.length > 0) {
		return (
			<CommentsList
				key="comments"
				mode="thread"
				initialState={initialVirtualScrollerState}
				setStateActionCreator={setVirtualScrollerState}
				items={shownComments}
				itemComponent={ThreadComment}
				getCommentById={getCommentById}
				{...rest}
			/>
		)
	}

	return null
}

ThreadCommentsList.propTypes = {
	thread: thread.isRequired,
	shownComments: PropTypes.arrayOf(comment).isRequired,
	getCommentById: PropTypes.func.isRequired
}

type ThreadCommentsListProps = {
	thread: Thread,
	shownComments: Comment[],
	getCommentById: GetCommentById
} & Omit<Props<typeof CommentsList>,
	'mode' |
	'initialState' |
	'setStateActionCreator' |
	'items' |
	'itemComponent' |
	'getCommentById'
> & {
	itemComponentProps?: Omit<Props<typeof ThreadComment>,
		keyof ItemComponentVirtualScrollerProps<Thread, any>
	>
}