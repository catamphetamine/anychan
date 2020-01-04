import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { post } from '../PropTypes'
import getMessages, { getCountryName } from '../messages'
import { getChan, getAbsoluteUrl, isDeployedOnChanDomain } from '../chan'
import UserData from '../UserData/UserData'

import StarIcon from './StarIcon'

import CountryFlag from 'webapp-frontend/src/components/CountryFlag'
import AnonymousCountryIcon from 'webapp-frontend/assets/images/icons/anonymous.svg'

import AnonymousPersonIcon from '../../assets/images/icons/person-outline-anonymous.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'
import PersonFillIcon from 'webapp-frontend/assets/images/icons/menu/person-fill.svg'
import DislikeIcon from 'webapp-frontend/assets/images/icons/dislike.svg'
import VerifiedIcon from 'webapp-frontend/assets/images/icons/verified.svg'

import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import AnonymousIcon from '../../assets/images/icons/anonymous.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './ThreadCommentHeader.css'

export default function Header({ post, locale }) {
	const isThreadAuthorId = post.threadHasAuthorIds && post.isThreadAuthor
	const authorIconIsOriginalPoster = isThreadAuthorId
	let authorName = post.authorName
	if (isThreadAuthorId && !authorName) {
		authorName = getMessages(locale).post.threadAuthor
	}
	// On `2ch.hk` original poster's posts don't have `authorId`.
	const authorNameIsId = post.authorIdName || isThreadAuthorId
	// On `2ch.hk` original poster's posts don't have `authorId`.
	if (!hasAuthor(post) && !isThreadAuthorId) {
		return null
	}
	// Testing.
	// post.authorId = 'af1e80'
	// post.authorName = 'Gabe Newell'
	// post.authorRole = 'administrator'
	// post.authorTripCode = '!!tripcode35ae80'
	// post.authorEmail = 'user@example.com'
	const authorRoleName = post.authorRole && (getRoleName(post.authorRole, post, locale) || post.authorRole)
	// `title` doesn't work on `<svg/>` itself for some reason (checked in Chrome).
	return (
		<div
			className={classNames(
				'post__author',
				post.authorRole && `post__author--${post.authorRole}`,
				// {
				// 	'post__author--generic': !post.authorRole
				// }
			)}>
			<div className="post__author-icon-container">
				{authorIconIsOriginalPoster &&
					<span title={getMessages(locale).post.threadAuthor}>
						<AnonymousPersonIcon
							className={classNames('post__author-icon', 'post__author-icon--outline', 'post__author-icon--thread-author', {
								'post__author-icon--role': post.authorRole
							})}/>
					</span>
				}
				{!authorIconIsOriginalPoster &&
					<PersonIcon
						className={classNames('post__author-icon', {
							'post__author-icon--outline': post.authorIdColor,
							'post__author-icon--role': post.authorRole
						})}/>
				}
				{!authorIconIsOriginalPoster && post.authorIdColor &&
					<PersonIconBottomBorder
						className={classNames('post__author-icon', {
							'post__author-icon--outline': post.authorIdColor,
							'post__author-icon--role': post.authorRole
						})}/>
				}
				{!authorIconIsOriginalPoster && post.authorIdColor &&
					<PersonFillIcon
						className="post__author-icon"
						style={{
							color: post.authorIdColor
						}}/>
				}
			</div>
			<div className="post__author-info">
				{post.authorId && !authorNameIsId &&
					<span className="post__author-id">
						{post.authorId}
						{' '}
					</span>
				}
				{authorName &&
					<span className={classNames('post__author-name', {
						'post__author-name--id': authorNameIsId,
						'post__author-name--role': post.authorRole
					})}>
						{authorName}
						{' '}
					</span>
				}
				{authorName && post.authorVerified &&
					<React.Fragment>
						<span title={getMessages(locale).post.verified}>
							<VerifiedIcon className="post__author-verified"/>
						</span>
						{' '}
					</React.Fragment>
				}
				{post.authorRole &&
					<React.Fragment>
						<span className={classNames('post__author-role', {
							'post__author-role--supplementary': post.authorId || authorName
						})}>
							{/* Not using `authorRoleName.toLowerCase()` here because
								  in German nouns are supposed to start with a capital letter. */}
							{authorRoleName}
						</span>
						{' '}
					</React.Fragment>
				}
				{post.authorEmail &&
					<React.Fragment>
						<a
							href={`mailto:${post.authorEmail}`}
							className={classNames('post__author-email', {
								'post__author-email--separated': authorName || post.authorRole
							})}>
							{post.authorEmail}
						</a>
						{' '}
					</React.Fragment>
				}
				{post.authorTripCode &&
					<span className="post__author-trip-code">
						{post.authorTripCode}
					</span>
				}
			</div>
		</div>
	)
}

Header.propTypes = {
	post: post.isRequired,
	locale: PropTypes.string.isRequired
}

function TrackedThreadStatusIcon({ boardId, threadId, ...rest }) {
	const isTracked = useSelector(({ threadTracker }) => {
		const trackedThreadsIndex = threadTracker.trackedThreadsIndex
		return trackedThreadsIndex[boardId] && trackedThreadsIndex[boardId].includes(threadId)
	})
	if (isTracked) {
		return (
			<StarIcon {...rest}/>
		)
	}
	return null
}

export const HEADER_BADGES = [
	{
		name: 'tracking',
		icon: TrackedThreadStatusIcon,
		// icon: StarIcon,
		title: (post, locale) => {
			return getMessages(locale).trackedThreads.trackedThread
		},
		getIconProps: (post, locale) => ({
			boardId: post.boardId,
			threadId: post.id
		}),
		condition: (post) => {
			return post.mode === 'board'
		}
	},
	{
		name: 'banned',
		icon: StopIcon,
		title: (post, locale) => {
			if (post.authorBanReason) {
				return getMessages(locale).post.banned + getMessages(locale).post.bannedReason.replace('{0}', post.authorBanReason)
			}
			return getMessages(locale).post.banned
		},
		condition: post => post.authorBan
	},
	{
		name: 'sage',
		icon: DislikeIcon,
		title: (post, locale) => 'Sage',
		condition: post => post.isSage
	},
	{
		name: 'original-poster',
		icon: AnonymousIcon,
		title: (post, locale) => getMessages(locale).post.threadAuthor,
		// If there are author IDs in the thread then "Original poster" is
		// gonna be the post author name instead of being a badge.
		condition: post => post.mode === 'thread' && post.isThreadAuthor && !post.threadHasAuthorIds
	},
	{
		name: 'country',
		getIcon: (post, locale) => {
			if (post.authorCountry) {
				return CountryFlagBadge
			}
			return ChanFlagBadge
		},
		getIconProps: (post, locale) => {
			if (post.authorCountry) {
				return {
					country: post.authorCountry,
					name: post.authorCountry === 'ZZ' ?
						getMessages(locale).country.anonymous :
						getCountryName(post.authorCountry, locale)
				}
			}
			return {
				// country: post.authorBadgeId,
				url: post.authorBadgeUrl,
				name: post.authorBadgeName
			}
		},
		title: (post, locale) => {
			if (post.authorCountry) {
				return post.authorCountry === 'ZZ' ?
					getMessages(locale).country.anonymous :
					getCountryName(post.authorCountry, locale)
			}
			return post.authorBadgeName
		},
		condition: post => post.authorCountry || post.authorBadgeName
	},
	{
		name: 'bump-limit',
		icon: SinkingBoatIcon,
		title: (post, locale) => getMessages(locale).post.bumpLimitReached,
		// On `2ch.hk` there can be "rolling" threads which aren't "sticky".
		condition: (post, thread) => post.mode === 'board' && post.isBumpLimitReached
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: (post, locale) => getMessages(locale).post.sticky,
		condition: (post, thread) => post.isSticky
	},
	{
		name: 'rolling',
		icon: InfinityIcon,
		title: (post, locale) => getMessages(locale).post.rolling,
		condition: (post, thread) => post.isRolling
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: (post, locale) => getMessages(locale).post.closed,
		condition: (post, thread) => post.isLocked
	}
]

function getRoleName(authorRole, post, locale) {
	if (post.authorRoleScope) {
		const roleNames = getMessages(locale).role[post.authorRoleScope]
		if (roleNames && roleNames[authorRole]) {
			return roleNames[authorRole]
		}
	}
	return getMessages(locale).role[authorRole]
}

function CountryFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<CountryFlag_ {...rest}/>
		</div>
	)
}

function CountryFlag_({ country, name }) {
	if (country === 'ZZ') {
		return (
			<AnonymousCountryIcon
				title={name}
				className="CountryFlag--anonymous"/>
		)
	}
	return (
		<CountryFlag
			country={country}
			name={name}/>
	)
}

function ChanFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<ChanFlag {...rest}/>
		</div>
	)
}

function ChanFlag({ name, url, ...rest }) {
	// let url = getChan().countryFlagUrl
	// // Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// // https://2ch.hk/icons/logos/krym.gif
	// if (getChan().id === '2ch' && country === 'krym') {
	// 	url = url.replace(/\.png$/, '.gif')
	// }
	// Transform relative URL to an absolute one.
	url = getAbsoluteUrl(url)
	// src={url.replace('{country}', country)}
	return (
		<img
			{...rest}
			alt={name}
			src={url}
			className="post__custom-country-flag"/>
	)
}

function PersonIconBottomBorder(props) {
	return (
		<svg viewBox="0 0 100 100" {...props}>
			<line
				stroke="currentColor"
				strokeWidth={10}
				x1={10}
				y1={100}
				x2={90}
				y2={100}/>
		</svg>
	)
}

export function hasAuthor(post) {
	return post.authorId || post.authorName || post.authorEmail || post.authorRole || post.authorTripCode
}