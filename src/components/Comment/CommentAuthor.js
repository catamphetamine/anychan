import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { comment } from '../../PropTypes.js'
import getMessages from '../../messages/index.js'

import AnonymousPersonIcon from '../../../assets/images/icons/person-outline-anonymous.svg'
import PersonIcon from 'frontend-lib/icons/fill-and-outline/person-outline.svg'
// import PersonFillIcon from 'frontend-lib/icons/fill-and-outline/person-fill.svg'
import VerifiedIcon from 'frontend-lib/icons/verified.svg'

import './CommentAuthor.css'

export default function CommentAuthor({ post, compact, locale }) {
	// A thread's author doesn't necessarily have an `authorId`.
	// For example, that'd be the case when the thread's author
	// is a moderator at `4chan.org`.
	// Also, at `2ch.hk`, a thread author doesn't have an `authorId`
	// on any comment they leave in their own thread.
	const showThreadAuthorLabelAsAuthorId = post.threadHasAuthorIds && post.authorIsThreadAuthor && !post.isRootComment
	let authorName = post.authorName
	if (showThreadAuthorLabelAsAuthorId && !authorName) {
		authorName = getMessages(locale).post.threadAuthor
	}
	// On `2ch.hk` original poster's posts don't have `authorId`.
	const authorNameIsId = post.authorNameIsId || showThreadAuthorLabelAsAuthorId
	if (!hasAuthor(post) && !showThreadAuthorLabelAsAuthorId) {
		return null
	}
	// Testing.
	// post.authorId = 'af1e80'
	// post.authorName = 'Gabe Newell'
	// post.authorRole = 'administrator'
	// post.authorTripCode = '!!tripcode35ae80'
	// post.authorEmail = 'user@example.com'
	const authorRoleName = post.authorRole && (getRoleName(post.authorRole, post, locale) || post.authorRole)
	const authorInfo = []
	if (shouldShowAuthorId(post) && !authorNameIsId) {
		authorInfo.push({
			key: 'id',
			element: (
				<span className="CommentAuthor-id">
					{post.authorId}
				</span>
			)
		})
	}
	if (authorName) {
		authorInfo.push({
			key: 'name',
			element: (
				<span className={classNames('CommentAuthor-name', {
					'CommentAuthor-name--id': authorNameIsId,
					'CommentAuthor-name--role': post.authorRole
				})}>
					{authorName}
				</span>
			)
		})
	}
	if (authorName && post.authorVerified) {
		authorInfo.push({
			key: 'verified',
			element: (
				<span title={getMessages(locale).post.verified}>
					<VerifiedIcon className="CommentAuthor-verified"/>
				</span>
			)
		})
	}
	if (post.authorRole) {
		authorInfo.push({
			key: 'role',
			element: (
				<span className={classNames('CommentAuthor-role', {
					// 'CommentAuthor-role--supplementary': shouldShowAuthorId(post) || authorName
				})}>
					{/* Not using `authorRoleName.toLowerCase()` here because
						  in German nouns are supposed to start with a capital letter. */}
					{authorRoleName}
				</span>
			)
		})
	}
	if (post.authorEmail) {
		authorInfo.push({
			key: 'email',
			element: (
				<a
					href={`mailto:${post.authorEmail}`}
					className={classNames('CommentAuthor-email', {
						// 'CommentAuthor-email--separated': authorName || post.authorRole
					})}>
					{post.authorEmail}
				</a>
			)
		})
	}
	if (post.authorTripCode) {
		authorInfo.push({
			key: 'tripCode',
			element: (
				<span className="CommentAuthor-tripCode">
					{post.authorTripCode}
				</span>
			)
		})
	}
	const authorInfoSpaced = []
	let i = 0
	while (i < authorInfo.length) {
		const stuff = authorInfo[i]
		// Add the item.
		authorInfoSpaced.push(stuff)
		// Add spacer after the item (if it's not the last one).
		if (i < authorInfo.length - 1) {
			authorInfoSpaced.push({
				key: stuff.key + ':spacer',
				element: <CommentAuthorSeparator/>
			})
		}
		i++
	}
	// `title` doesn't work on `<svg/>` itself for some reason (checked in Chrome).
	return (
		<div
			className={classNames(
				'CommentAuthor',
				post.authorRole && `CommentAuthor--${post.authorRole}`,
				{
					// 'CommentAuthor--generic': !post.authorRole,
					'CommentAuthor--compact': compact
				}
			)}>
			<CommentAuthorIcon
				post={post}
				locale={locale}
				showThreadAuthorLabelAsAuthorId={showThreadAuthorLabelAsAuthorId}/>
			<div className="CommentAuthor-info">
				{authorInfoSpaced.map(({ key, element }) => React.cloneElement(element, { key }))}
			</div>
		</div>
	)
}

CommentAuthor.propTypes = {
	post: comment.isRequired,
	compact: PropTypes.bool,
	locale: PropTypes.string.isRequired
}

function CommentAuthorSeparator() {
	return (
		<span className="CommentAuthor-separator">
			·
		</span>
	)
}

function getRoleName(authorRole, post, locale) {
	if (post.authorRoleScope) {
		const roleNames = getMessages(locale).role[post.authorRoleScope]
		if (roleNames && roleNames[authorRole]) {
			return roleNames[authorRole]
		}
	}
	return getMessages(locale).role[authorRole]
}

// function PersonIconBottomBorder(props) {
// 	return (
// 		<svg viewBox="0 0 100 100" {...props}>
// 			<line
// 				stroke="currentColor"
// 				strokeWidth={10}
// 				x1={10}
// 				y1={100}
// 				x2={90}
// 				y2={100}/>
// 		</svg>
// 	)
// }

export function hasAuthor(post) {
	return shouldShowAuthorId(post) ||
		post.authorName ||
		post.authorEmail ||
		post.authorRole ||
		post.authorTripCode
}

function shouldShowAuthorId(post) {
	return post.authorId && (post.viewingMode === 'thread' || post.viewingMode === 'channel-latest-comments')
}

function CommentAuthorIcon({
	post,
	locale,
	showThreadAuthorLabelAsAuthorId
}) {
	return (
		<div className={classNames('CommentAuthorIcon', {
			'CommentAuthorIcon--color': !showThreadAuthorLabelAsAuthorId && shouldShowAuthorId(post)
		})}>
			{showThreadAuthorLabelAsAuthorId &&
				<span title={getMessages(locale).post.threadAuthor}>
					<AnonymousPersonIcon
						className={classNames(
							'CommentAuthor-icon',
							'CommentAuthor-icon--outline',
							'CommentAuthor-icon--threadAuthor', {
								'CommentAuthor-icon--role': post.authorRole
							}
						)}/>
				</span>
			}
			{!showThreadAuthorLabelAsAuthorId &&
				<React.Fragment>
					{shouldShowAuthorId(post) &&
						<div
							className="CommentAuthor-icon CommentAuthor-icon--color"
							style={{
								backgroundColor: post.authorIdColor
							}}/>
					}
					{!shouldShowAuthorId(post) &&
						<PersonIcon
							className={classNames('CommentAuthor-icon', 'CommentAuthor-icon--generic', {
								// 'CommentAuthor-icon--outline': post.authorIdColor,
								'CommentAuthor-icon--role': post.authorRole
							})}/>
					}
						{/* Coloring the person icon turned out to not work well-enough:
						    the icon is small and colors aren't discernible enough.
						    Instead, a colored square is drawn instead of a colored person icon:
						    this way it's bigger in side and colors are more discernible
						    when scrolling through a thread. */}
						{/*post.authorIdColor &&
							<React.Fragment>
								<PersonIconBottomBorder
									className={classNames('CommentAuthor-icon', {
										'CommentAuthor-icon--outline': post.authorIdColor,
										'CommentAuthor-icon--role': post.authorRole
									})}/>
								<PersonFillIcon
									className="CommentAuthor-icon"
									style={{
										color: post.authorIdColor
									}}/>
							</React.Fragment>
						*/}
				</React.Fragment>
			}
		</div>
	)
}

CommentAuthorIcon.propTypes = {
	post: comment.isRequired,
	locale: PropTypes.string.isRequired,
	showThreadAuthorLabelAsAuthorId: PropTypes.bool
}