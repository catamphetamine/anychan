import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-responsive-ui'
import classNames from 'classnames'

import CloseIcon from 'webapp-frontend/assets/images/icons/close.svg'
import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'

import ThreadCommentTree from '../components/ThreadCommentTree'

import {
	comment as commentType,
	thread as threadType,
	board as boardType
} from '../PropTypes'

import getMessages from '../messages'

import './InReplyToModal.css'

const InReplyToModalOverlayClassName = 'InReplyToModalOverlay'

export default function InReplyToModal({
	board,
	thread,
	history,
	isOpen,
	onClose,
	onShowComment,
	onGoToComment,
	onGoBack
}) {
	const comment = history[history.length - 1]
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const onPostUrlClick = useCallback((event, post) => {
		onGoToComment(post)
		onClose()
	}, [onClose])
	// `overlayClassName` is used in `Thread.js`
	// to get `document.querySelector('.InReplyToModalOverlay')`.
	// // `shouldReturnFocusAfterClose` is `false` because otherwise
	// // it would focus on the `post-link` after the modal is closed
	// // and that could sometimes result in scroll position jumping.
	return (
		<Modal
			isOpen={isOpen}
			close={onClose}
			aria-label={getMessages(locale).inReplyTo}
			closeLabel={getMessages(locale).actions.close}
			className="InReplyToModal"
			overlayClassName={InReplyToModalOverlayClassName}>
			<Modal.Content>
				<div className="InReplyToModalHeader">
					<InReplyToModalBack
						history={history}
						locale={locale}
						onClose={onClose}
						onGoBack={onGoBack}/>
					<InReplyToModalClose
						history={history}
						locale={locale}
						onClose={onClose}/>
				</div>
				{/*
				Don't preserve comment tree state when navigating to
				the next quoted comment: `key` is used for that.
				Also, don't set HTML `id` attribute because such comment
				may already be rendered on the page: `id={null}` is used for that.
				*/}
				<ThreadCommentTree
					key={comment.id}
					id={null}
					comment={comment}
					thread={thread}
					board={board}
					locale={locale}
					dispatch={dispatch}
					onShowComment={onShowComment}
					onPostUrlClick={onPostUrlClick}
					mode="thread"
					compact={false}/>
			</Modal.Content>
		</Modal>
	)
}

InReplyToModal.propTypes = {
	board: boardType.isRequired,
	thread: threadType.isRequired,
	history: PropTypes.arrayOf(commentType).isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onShowComment: PropTypes.func.isRequired,
	onGoToComment: PropTypes.func
}

function InReplyToModalBack({
	onClose,
	onGoBack,
	history,
	locale
}) {
	const isInitial = history.length === 2
	if (isInitial) {
		return null
	}
	return (
		<button
			type="button"
			onClick={isInitial ? onClose : onGoBack}
			className={classNames('rrui__button-reset', 'InReplyToModalBack')}>
			<LeftArrow className="InReplyToModalBackIcon"/>
			<span className="InReplyToModalBackText">
				{!isInitial &&
					<span className="InReplyToModalBackCounter">
						{history.length - 1}
					</span>
				}
				{getMessages(locale).actions.back}
			</span>
		</button>
	)
}

InReplyToModalBack.propTypes = {
	onClose: PropTypes.func.isRequired,
	onGoBack: PropTypes.func.isRequired,
	history: PropTypes.arrayOf(commentType).isRequired,
	locale: PropTypes.string.isRequired
}

function InReplyToModalClose({
	onClose,
	history,
	locale
}) {
	const isInitial = history.length === 2
	if (!isInitial) {
		return null
	}
	return (
		<button
			type="button"
			onClick={onClose}
			className={classNames('rrui__button-reset', 'InReplyToModalClose')}>
			<CloseIcon className="InReplyToModalCloseIcon"/>
			<span className="InReplyToModalCloseText">
				{getMessages(locale).actions.close}
			</span>
		</button>
	)
}

InReplyToModalClose.propTypes = {
	onClose: PropTypes.func.isRequired,
	history: PropTypes.arrayOf(commentType).isRequired,
	locale: PropTypes.string.isRequired
}

export const InReplyToModalCloseTimeout = Modal.defaultProps.closeTimeout

export function InReplyToModalScrollToTopAndFocus() {
	const modalScrollable = document.querySelector('.' + InReplyToModalOverlayClassName)
	if (modalScrollable) {
		modalScrollable.scrollTo(0, 0)
		// Focus the modal body, because otherwise the focus would be lost
		// and would move to `<body/>` because the link that has been clicked
		// is no longer rendered.
		// If the focus wasn't restored, closing the modal on Escape wouldn't work.
		modalScrollable.firstChild.focus()
	}
}