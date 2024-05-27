import type { Props as VirtualScrollerProps } from 'virtual-scroller/react'
import type { State as VirtualScrollerState } from 'virtual-scroller'
import type { Thread, Comment, CommentId, GetCommentById, Mode, CommentTreeItemStateWithReplyAbility } from '@/types'
// import type { MutableRefObject } from 'react'
import type { UnknownAction } from 'redux'

import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'
import { useBeforeNavigateToAnotherPage } from 'react-pages'

import './CommentsList.css'

export function ThreadsListOnChannelPage<ItemComponentProps extends object>(props: CommentsListProps<Thread, ItemComponentProps>) {
	return (
		<CommentsList<Thread, ItemComponentProps> {...props}/>
	)
}

export function CommentsListOnThreadPage<ItemComponentProps extends object>(props: CommentsListProps<Comment, ItemComponentProps>) {
	return (
		<CommentsList<Comment, ItemComponentProps> {...props}/>
	)
}

function CommentsList<Item extends ItemType, ItemComponentProps extends object>({
	mode,
	readyToStartVirtualScroller,
	initialState,
	setStateActionCreator,
	getCommentById,
	transformInitialItemState,
	// stateRef,
	className,
	...rest
}: CommentsListProps<Item, ItemComponentProps>) {
	// `virtual-scroller` state.
	// const _stateRef = useRef<State<Item>>()
	// const virtualScrollerState = stateRef || _stateRef
	const virtualScrollerState = useRef<CommentsListState<Item>>()
	const onVirtualScrollerStateChange = useCallback(
		(state: CommentsListState<Item>) => {
			virtualScrollerState.current = state
		},
		[]
	)

	// Returns an initial state for a `virtual-scorller` item.
	const getInitialItemState = useCallback((item: Item) => {
		return getCommentsListItemInitialState(item, {
			mode,
			transformInitialItemState
		})
	}, [
		mode,
		transformInitialItemState
	])

	// `onItemInitialRender` property of `<VirtualScroller/>` shouldn't change
	// because `<VirtualScroller/>` doesn't support handling changes of such properties.
	// That means that `getCommentById()` shouldn't change too.
	const onItemInitialRender = useCallback(
		(item: Item) => {
			onCommentInitialRender(item, { mode, getCommentById })
		},
		[mode, getCommentById]
	)

	const dispatch = useDispatch()

	// Saves `virtual-scroller` state in Redux on navigate away from the page
	// in case the user decides to navigate "Back" to this page.
	useBeforeNavigateToAnotherPage(({ instantBack }) => {
		// console.log(`* On navigate from ${mode} page`)
		if (instantBack) {
			if (setStateActionCreator) {
				// Save `virtual-scroller` state in Redux state.
				dispatch(setStateActionCreator(virtualScrollerState.current))
			}
		}
	})

	return (
		<VirtualScroller
			{...rest}
			bypass={typeof window === 'undefined'}
			readyToStart={readyToStartVirtualScroller}
			className={classNames(className, 'CommentsList')}
			initialState={initialState}
			getInitialItemState={getInitialItemState}
			onStateChange={onVirtualScrollerStateChange}
			onItemInitialRender={onItemInitialRender}
			getItemId={getItemId}
			measureItemsBatchSize={12}
		/>
	)
}

CommentsList.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	readyToStartVirtualScroller: PropTypes.bool,
	initialState: PropTypes.object,
	setStateActionCreator: PropTypes.func,
	getCommentById: PropTypes.func,
	transformInitialItemState: PropTypes.func,
	// stateRef: PropTypes.object,
	className: PropTypes.string
}

// This function is used in `virtual-scroller`
// to get an ID of an item.
function getItemId<Item extends ItemType>(item: Item) {
	return item.id
}

function getComment<Item extends ItemType>(item: Item, mode: Mode): Comment {
	if (isThread(item, mode)) {
		return item.comments[0]
	} else {
		return item
	}
}

function createGetCommentByIdForLatestComments(thread: Thread) {
	return (commentId: CommentId) => {
		if (commentId === thread.comments[0].id) {
			return thread.comments[0]
		}
		for (const otherLatestComment of thread.latestComments) {
			if (otherLatestComment.id === commentId) {
				return otherLatestComment
			}
		}
		// A comment with ID `commentId` might not be present
		// in the list of "latest comments" because that list
		// is just a "peek".
	}
}

// This function should be called on a `thread` or a `comment` object
// when it's about to be rendered for the first time.
// This function is "idempotent" meaning that it could be called multiple times
// with no futher effect.
export function onCommentInitialRender<Item extends ItemType>(item: Item, {
	mode,
	getCommentById
}: {
	mode: Mode,
	getCommentById?: GetCommentById
}) {
	const comment = getComment(item, mode)

	// Parse comment content.
	comment.parseContent({ getCommentById })

	// Also parse the "latest comments" if the user is viewing a list of threads on a channel's page.
	if (isThread(item, mode)) {
		const thread = item
		if (thread.latestComments) {
			for (const latestComment of thread.latestComments) {
				latestComment.parseContent({
					getCommentById: createGetCommentByIdForLatestComments(thread)
				})
			}
		}
	}
}

// Returns an initial state for a `<CommentsList/>` item.
export function getCommentsListItemInitialState<Item extends ItemType>(item: Item, {
	mode,
	ignoreHiddenState,
	transformInitialItemState
}: {
	mode: Mode,
	ignoreHiddenState?: boolean,
	transformInitialItemState?: (itemState: ItemState, item: Item) => ItemState
}): ItemState {
	let itemState: ItemState = {}
	if (!ignoreHiddenState) {
		itemState.hidden = isThread(item, mode) ? item.comments[0].hidden : item.hidden
	}
	if (transformInitialItemState) {
		itemState = transformInitialItemState(itemState, item)
	}
	return itemState
}

function isThread(item: ItemType, mode: Mode): item is Thread {
	return mode === 'channel'
}

// TypeScript:

type CommentsListProps<Item, ItemComponentProps extends object> = {
	mode: Mode,
	readyToStartVirtualScroller?: boolean,
	itemComponentProps?: ItemComponentProps,
	initialState?: CommentsListState<Item>,
	setStateActionCreator?: (state: CommentsListState<Item>) => UnknownAction,
	getCommentById?: GetCommentById,
	transformInitialItemState?: (itemState: ItemState, item: Item) => ItemState,
	// stateRef?: RefObject<State<Item>>,
	className?: string
} & VirtualScrollerProps<ItemComponentProps, Item, ItemState>;

type ItemType = Comment | Thread

type ItemState = Record<string, any> & { hidden?: boolean }

type CommentsListState<Item> = CommentTreeItemStateWithReplyAbility & VirtualScrollerState<Item, ItemState>
