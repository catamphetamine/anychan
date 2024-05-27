import type { Mode, Comment, ThreadId, Messages, onAttachmentClick } from '@/types'
import type { ReactNode } from 'react'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CommentThumbnail from './CommentThumbnail.js'

import {
	comment as commentType,
	threadId
} from '../../PropTypes.js'

// I don't know why are there constants defined in `window` object.
// Maybe they were meant to be some "default" constants that
// could be overwridden by a user via javascript or via the Console, or smth.
window.SHOW_POST_THUMBNAIL = true
// window.SHOW_POST_STATS_ON_THE_LEFT_SIDE = false

const WrapCommentWithThumbnail = React.forwardRef<HTMLElement, WrapCommentWithThumbnailProps>(({
	as: Component = 'div',
	mode,
	comment,
	threadId,
	messages,
	expandAttachments,
	onAttachmentClick,
	showThumbnail: shouldShowThumbnail,
	className,
	children,
	...rest
}, ref) => {
	// I don't know why does it read the value from `window`.
	// Maybe it was meant to be a "default" constant that
	// could be overwridden by a user via javascript or via the Console, or smth.
	const showThumbnail = shouldShowThumbnail && window.SHOW_POST_THUMBNAIL;

	return (
		<CommentThumbnail
			mode={mode}
			comment={comment}
			threadId={threadId}
			messages={messages}
			expandAttachments={expandAttachments}
			onAttachmentClick={onAttachmentClick}
		>
			{(thumbnailElement, { thumbnailSizeVarStyle }) => (
				<Component
					{...rest}
					ref={ref}
					data-comment-id={comment.id}
					style={showThumbnail ? thumbnailSizeVarStyle : undefined}
					className={classNames(className, {
						'Comment--showThumbnail': window.SHOW_POST_THUMBNAIL,
						'Comment--hasThumbnail': showThumbnail && thumbnailElement,
						'Comment--hasNoThumbnail': showThumbnail && !thumbnailElement,
						'Comment--hidden': false
					})}>
					{showThumbnail && thumbnailElement &&
						<div className="Comment-thumbnail">
							{thumbnailElement}
						</div>
					}
					{showThumbnail && !thumbnailElement &&
						<div className="Comment-thumbnailPlaceholder"/>
					}
					{children}
				</Component>
			)}
		</CommentThumbnail>
	)

	// commentCreatedAt={comment.createdAt}
	// commentUpdatedAt={comment.updatedAt}
})

WrapCommentWithThumbnail.propTypes = {
	// Doesn't support `string`?
	// @ts-expect-error
	as: PropTypes.elementType,
	mode: PropTypes.oneOf(['channel', 'thread'] as const).isRequired,
	// Expects unused properties like `index` on a `Comment`.
	// @ts-expect-error
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	messages: PropTypes.object.isRequired,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func,
	showThumbnail: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

interface ComponentProps {
	id?: string;
}

interface WrapCommentWithThumbnailProps extends ComponentProps {
	as?: React.ElementType,
	mode: Mode,
	comment: Comment,
	threadId: ThreadId,
	messages: Messages,
	expandAttachments?: boolean,
	onAttachmentClick: onAttachmentClick,
	showThumbnail?: boolean,
	className?: string,
	children: ReactNode
}

export default WrapCommentWithThumbnail