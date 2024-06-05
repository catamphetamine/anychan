import type { InlineElementPostLinkWithId, Comment, GetCommentById, CommentTreeItemStateWithReplyAbility } from '@/types'

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import CommentTree_ from 'social-components-react/components/CommentTree.js'
import CommentBlock from './Comment/CommentBlock.js'

import { POST_FORM_INPUT_FIELD_NAME } from './PostFormWithAttachments.js'

import { commentTreeState } from '../PropTypes.js'
import { InlineElementPostLink } from 'social-components'

type State = CommentTreeItemStateWithReplyAbility

export default function CommentTreeBranch({
	// This is the root comment of this `<CommentTree/>`.
	comment,

	// `initialState` property here is a `virtual-scroller` `state` object:
	// it contains both the state of the `virtual-scroller` and the state of the `<CommentTree/>`.
	// It's just simpler to store both those states in one object,
	// since `virtual-scroller` provides a way to do that.
	initialState,

	// `setState()` property here is supplied by `virtual-scroller`:
	// it provides a way to update the `virtual-scroller` `state` object
	// with the state of the `<CommentTree/>`.
	//
	// The `<CommentTree/>` component is also used without `virtual-scroller` in `InReplyToModal` component.
	// In that case, it also provides its own variant of `setState()` function.
	//
	// This `setState()` function will be called with the new state as an argument
	// whenever the state of the `<CommentTree/>` changes.
	//
	setState,

	// `onHeightDidChange()` is supplied by `virtual-scroller`.
	// It should be called whenever a comment tree's height changes
	// so that `virtual-scroller` could update the tree's height in its height cache.
	onHeightDidChange,

	// (optional)
	// Returns the props for rendering the comment component.
	getComponentProps,

	// Returns a comment object by ID.
	getCommentById,

	// `<InReplyToModal/>` passes `dialogueTraceStyle="sideways"`.
	dialogueTraceStyle = 'straight-through',

	// Any other options for `<CommentTree_/>`.
	...rest
}: {
	comment: Comment,
	initialState?: State,
	setState: (state: State) => void,
	onHeightDidChange?: () => void,
	getComponentProps?: () => Record<string, any>,
	getCommentById: GetCommentById,
	dialogueTraceStyle?: 'sideways' | 'straight-through'
}) {
	const getCommentComponentProps = useCallback(({
		// `initialState` property is passed here by `CommentTree` component.
		// It represents the initial state of the comment tree.
		// If the initial state is "empty" then it's gonna be an empty object `{}`.
		initialState,

		// `updateState` property is passed here by `CommentTree` component.
		// `updateState` here is not the same as the `setState` property of the main component.
		// Instead, `updateState` here is a function of `transformState` function:
		// when called as `updateState(transformState)`, it updates the state of the comment tree
		// by applying a transformation to it: `updateState((state) => ({ ... }))`.
		updateState
	}: {
		initialState: State,
		updateState: (updater: (state: State) => State) => void
	}) => {
		return {
			...(getComponentProps ? getComponentProps() : undefined),
			initialShowReplyForm: initialState.showReplyForm,
			onShowReplyFormChange: (showReplyForm: State['showReplyForm']) => {
				updateState((state: State) => ({
					...state,
					showReplyForm,
					// Reset reply form state.
					replyForm: undefined,
					replyFormInputHeight: undefined,
					replyFormFiles: undefined,
					replyFormAttachments: undefined
				}))
			},
			initialExpandContent: initialState.expandContent,
			onExpandContentChange: (expandContent: State['expandContent']) => {
				updateState((state: State) => ({
					...state,
					expandContent
				}))
			},
			initialExpandPostLinkQuotes: initialState.expandPostLinkQuotes,
			// `postLink._id`s are set in `enumeratePostLinks()`
			// in `./src/api/utility/addCommentProps.js`.
			// They're used instead of simply `postLink.meta.commentId`
			// because, for example, a comment could have several
			// `post-link`s to the same post, consequtive or
			// in different parts of its content.
			onPostLinkQuoteExpanded: ({ postLink }: { postLink: InlineElementPostLinkWithId }) => {
				updateState((state: State) => ({
					...state,
					expandPostLinkQuotes: {
						...(state && state.expandPostLinkQuotes),
						[postLink._id]: true
					}
				}))
			},
			onRenderedContentDidChange: () => {
				if (onHeightDidChange) {
					onHeightDidChange()
				}
			},
			initialHidden: initialState.hidden,
			setHidden: (hidden: State['hidden']) => {
				updateState((state: State) => ({
					...state,
					hidden
				}))
			},
			initialReplyFormState: initialState.replyForm,
			onReplyFormStateDidChange: (replyFormState: State['replyForm']) => {
				updateState((state: State) => {
					// Call `onHeightDidChange()` if reply form input error changed.
					// `helpers` object is passed by `easy-react-form`.
					const replyFormInputError = replyFormState.errors[POST_FORM_INPUT_FIELD_NAME]
					if (state.replyFormInputError !== replyFormInputError) {
						onHeightDidChange()
					}
					// Return new state.
					return {
						...state,
						replyForm: replyFormState,
						// This property is not used anywhere else.
						// It's just used to compare the "previous" value to the "new" one
						// in order to detect the cases when the form height has changed.
						replyFormInputError
					}
				})
			},
			// initialReplyFormInputValue: initialState.replyFormInputValue,
			// onReplyFormInputValueChange: (value) => {
			// 	updateState((state) => ({
			// 		...state,
			// 		replyFormInputValue: value
			// 	}))
			// },
			initialReplyFormError: initialState.replyFormError,
			onReplyFormErrorDidChange: (error: State['replyFormError']) => {
				updateState((state: State) => ({
					...state,
					replyFormError: error
				}))
			},
			initialReplyFormInputHeight: initialState.replyFormInputHeight,
			onReplyFormInputHeightDidChange: (height: State['replyFormInputHeight']) => {
				updateState((state: State) => ({
					...state,
					replyFormInputHeight: height
				}))
			},
			initialReplyFormFiles: initialState.replyFormFiles,
			onReplyFormFilesDidChange: (files: State['replyFormFiles']) => {
				updateState((state: State) => {
					// if (!isEqual(state.files, files)) {
					onHeightDidChange()
					// }
					return {
						...state,
						replyFormFiles: files
					}
				})
			},
			initialReplyFormAttachments: initialState.replyFormAttachments,
			onReplyFormAttachmentsDidChange: (attachments: State['replyFormAttachments']) => {
				updateState((state: State) => ({
					...state,
					replyFormAttachments: attachments
				}))
			}
		}
	}, [
		getComponentProps,
		onHeightDidChange
	])

	// This function is called when a replies tree for a comment is expanded.
	const onShowReply = useCallback((comment: Comment) => {
		comment.parseContent({ getCommentById })
	}, [getCommentById])

	// `<CommentTree_/>` passes the following properties to the `component`:
	// * `comment: object`
	// * `parentComment?: object`
	// * `elementRef: object`
	// * `showingReplies: boolean`
	// * `onToggleShowReplies: function`
	// * `toggleShowRepliesButtonRef: object`
	// * Anything returned from `getComponentProps()`

	return (
		<CommentTree_
			{...rest}
			comment={comment}
			initialState={initialState}
			onStateChange={setState}
			onDidToggleShowReplies={onHeightDidChange}
			dialogueTraceStyle={dialogueTraceStyle}
			onShowReply={onShowReply}
			component={CommentBlock}
			getComponentProps={getCommentComponentProps}
			isLinkedComment={isLinkedComment}
		/>
	)
}

CommentTreeBranch.propTypes = {
	comment: PropTypes.object.isRequired,

	// When `<CommentTree/>` is rendered on a thread page,
	// `state` property is supplied by `virtual-scroller`.
	// Initially it's `undefined`.
	//
	// When `<CommentTree/>` is rendered in `<InReplyToModal/>`,
	// `state` property is supplied by `<InReplyToModal/>`.
	// Initially it's `undefined`.
	//
	initialState: commentTreeState,

	// When `<CommentTree/>` is rendered on a thread page,
	// `setState()` property is supplied by `virtual-scroller`.
	// It updates the comment tree state in the `VirtualScroller` instance.
	//
	// When `<CommentTree/>` is rendered in `<InReplyToModal/>`,
	// `setState()` property is also supplied in order to
	// keep the state of a comment tree when navigating between
	// different comments in an in-reply-to history branch.
	//
	setState: PropTypes.func.isRequired,

	// When `<CommentTree/>` is rendered on a thread page,
	// `onHeightDidChange()` property is supplied by `virtual-scroller`.
	// It triggers `VirtualScroller` to re-measure the item element's height.
	//
	// When `<CommentTree/>` is rendered in `<InReplyToModal/>`,
	// `onHeightDidChange()` property is not supplied because
	// it doesn't use a `virtual-scroller` to render the content.
	//
	onHeightDidChange: PropTypes.func,

	// Returns the props for rendering the comment component.
	getComponentProps: PropTypes.func,

	// `getCommentById()` function is used to call `.parseContent()`
	// on a reply when it gets expanded in a comment tree.
	// That is required because initially comments' content is not parsed.
	// That is a performance optimization.
	getCommentById: PropTypes.func.isRequired,

	// Determines how the visual traces between comments of a "dialogue" are gonna look like:
	// * "sideways" — Paints the connection lines on the left side of the comments of a "dialogue".
	// * "straight-through" — Paints the connection line going directly through the comments of a "dialogue".
	//
	// "Dialogue" is a list of comments, each next comment being an only reply to the previous one.
	//
	// Example of a "dialogue":
	//
	// {
	// 	id: 1,
	// 	replies: [{
	// 		id: 5,
	// 		replies: [{
	// 			id: 10,
	// 			replies: [{
	// 				id: 11,
	// 				replies: [...]
	// 			}]
	// 		}]
	// 	}]
	// }
	//
	dialogueTraceStyle: PropTypes.oneOf([
		'straight-through',
		'sideways'
	])
}

function isLinkedComment(comment: Comment, postLink: InlineElementPostLink) {
	return comment.id === postLink.meta.commentId
}