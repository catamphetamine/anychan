import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post } from '../PropTypes'
import getMessages, { getCountryNames } from '../messages'
import { getChan, shouldUseRelativeUrls } from '../chan'

import CountryFlag from './CountryFlag'

import AnonymousPersonIcon from '../../assets/images/icons/person-outline-anonymous.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'
import PersonFillIcon from 'webapp-frontend/assets/images/icons/menu/person-fill.svg'
import DislikeIcon from 'webapp-frontend/assets/images/icons/dislike.svg'

import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import AnonymousIcon from '../../assets/images/icons/anonymous.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './ThreadCommentHeader.css'

export default function Header({ post, locale }) {
	let authorName = post.authorName
	let authorNameIsOriginalPoster = false
	if (post.threadHasAuthorIds && post.isThreadAuthor) {
		authorName = getMessages(locale).post.threadAuthor
		authorNameIsOriginalPoster = true
	}
	if (!(post.authorId || authorName || post.authorEmail || post.authorRole || post.tripCode)) {
		return null
	}
	const authorRoleName = post.authorRole && (getRoleName(post.authorRole, post, locale) || post.authorRole)
	return (
		<div
			className={classNames(
				'post__author',
				post.authorRole && `post__author--${post.authorRole}`, {
					'post__author--generic': !post.authorRole,
					'post__author--id': post.threadHasAuthorIds
				}
			)}>
			<div className="post__author-icon-container">
				{authorNameIsOriginalPoster &&
					<AnonymousPersonIcon className="post__author-icon"/>
				}
				{!authorNameIsOriginalPoster &&
					<PersonIcon
						className={classNames('post__author-icon', {
							'post__author-icon--outline': post.authorIdColor
						})}/>
				}
				{post.authorIdColor &&
					<PersonFillIcon
						className="post__author-icon"
						style={{
							color: post.authorIdColor
						}}/>
				}
			</div>
			{(post.authorId || authorName || post.authorEmail || post.authorRole) &&
				<div className="post__author-name">
					{post.authorId && !post.authorNameId && `${post.authorId} `}
					{authorName && `${authorName} `}
					{post.authorRole && !(post.authorId || authorName) && `${authorRoleName} `}
					{post.authorRole &&  (post.authorId || authorName) && `(${authorRoleName.toLowerCase()}) `}
					{post.authorEmail &&
						<span>
							<a href={`mailto:${post.authorEmail}`}>
								{post.authorEmail}
							</a>
							{' '}
						</span>
					}
				</div>
			}
			{post.tripCode &&
				<div className="post__author-trip-code">
					{post.tripCode}
				</div>
			}
		</div>
	)
}

Header.propTypes = {
	post: post.isRequired,
	locale: PropTypes.string.isRequired
}

export const HEADER_BADGES = [
	{
		name: 'banned',
		icon: StopIcon,
		title: (post, locale) => {
			if (post.authorBanReason) {
				return getMessages(locale).post.banned + getMessages(locale).post.bannedReason.replace('{0}', post.authorBanReason)
			}
			return getMessages(locale).post.banned
		},
		condition: post => post.authorBanned
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
		condition: post => post.isThreadAuthor && !post.threadHasAuthorIds
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
					name: getCountryNames(locale)[post.authorCountry]
				}
			}
			return {
				country: post.authorIconId,
				name: post.authorIconName
			}
		},
		title: (post, locale) => post.authorCountry ? getCountryNames(locale)[post.authorCountry] : post.authorIconName,
		condition: post => post.authorCountry || post.authorIconName
	},
	{
		name: 'bump-limit',
		icon: SinkingBoatIcon,
		title: (post, locale) => getMessages(locale).post.bumpLimitReached,
		// On `2ch.hk` there can be "rolling" threads which aren't "sticky".
		condition: (post, thread) => post.isBumpLimitReached
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
	if (post.authorRoleJurisdiction) {
		const roleNames = getMessages(locale).role[post.authorRoleJurisdiction]
		if (roleNames && roleNames[authorRole]) {
			return roleNames[authorRole]
		}
	}
	return getMessages(locale).role[authorRole]
}

function CountryFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<CountryFlag {...rest}/>
		</div>
	)
}

function ChanFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<ChanFlag {...rest}/>
		</div>
	)
}

function ChanFlag({ country, name, ...rest }) {
	let countryFlagUrl = getChan().countryFlagUrl
	// Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// https://2ch.hk/icons/logos/krym.gif
	if (getChan().id === '2ch' && country === 'krym') {
		countryFlagUrl = countryFlagUrl.replace(/\.png$/, '.gif')
	}
	// Transform relative URL to an absolute one.
	if (countryFlagUrl[0] === '/' && countryFlagUrl[1] !== '/') {
		if (!shouldUseRelativeUrls() ) {
			countryFlagUrl = getChan().website + countryFlagUrl
		}
	}
	return (
		<img
			{...rest}
			alt={name}
			src={countryFlagUrl.replace('{country}', country)}
			className="post__custom-country-flag"/>
	)
}