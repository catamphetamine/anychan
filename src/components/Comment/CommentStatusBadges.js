import React from 'react'
import { useSelector } from 'react-redux'

import StarIcon from '../StarIcon'
import AnonymousCountryIcon from 'webapp-frontend/assets/images/icons/anonymous.svg'
import CountryFlag from 'webapp-frontend/src/components/CountryFlag'

import getMessages, { getCountryName } from '../../messages'
import { getAbsoluteUrl } from '../../chan'

import DislikeIcon from 'webapp-frontend/assets/images/icons/dislike.svg'
import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import AnonymousIcon from '../../../assets/images/icons/anonymous.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'

export default [
	{
		name: 'tracking',
		// icon: TrackedThreadStatusIcon,
		icon: StarIcon,
		title: ({ post, locale }) => {
			return getMessages(locale).trackedThreads.trackedThread
		},
		getIconProps: ({ post, locale }) => ({
			boardId: post.boardId,
			threadId: post.id
		}),
		condition: (post, { isTracked }) => post.mode === 'board' && isTracked
	},
	{
		name: 'banned',
		icon: StopIcon,
		title: ({ post, locale }) => {
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
		title: ({ post, locale }) => 'Sage',
		condition: post => post.isSage
	},
	{
		name: 'original-poster',
		icon: AnonymousIcon,
		title: ({ post, locale }) => getMessages(locale).post.threadAuthor,
		// If there are author IDs in the thread then "Original poster" is
		// gonna be the post author name instead of being a badge.
		condition: post => post.mode === 'thread' && post.isThreadAuthor && !post.threadHasAuthorIds && !post.isRootComment
	},
	{
		name: 'country',
		getIcon: ({ post, locale }) => {
			if (post.authorCountry) {
				return CountryFlagBadge
			}
			return ChanFlagBadge
		},
		getIconProps: ({ post, locale }) => {
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
		title: ({ post, locale }) => {
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
		title: ({ post, locale }) => getMessages(locale).post.bumpLimitReached,
		// On `2ch.hk` there can be "rolling" threads which aren't "sticky".
		condition: (post) => post.mode === 'board' && post.isBumpLimitReached
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: ({ post, locale }) => getMessages(locale).post.sticky,
		condition: (post) => post.isSticky
	},
	{
		name: 'rolling',
		icon: InfinityIcon,
		title: ({ post, locale }) => getMessages(locale).post.rolling,
		condition: (post) => post.isRolling
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: ({ post, locale }) => getMessages(locale).post.closed,
		condition: (post) => post.isLocked
	}
]

// function TrackedThreadStatusIcon({ boardId, threadId, ...rest }) {
// 	const isTracked = useSelector(({ threadTracker }) => {
// 		const trackedThreadsIndex = threadTracker.trackedThreadsIndex
// 		return trackedThreadsIndex[boardId] && trackedThreadsIndex[boardId].includes(threadId)
// 	})
// 	if (isTracked) {
// 		return (
// 			<StarIcon {...rest}/>
// 		)
// 	}
// 	return null
// }

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
	// if (getChanId() === '2ch' && country === 'krym') {
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
			className="CommentFooterBadge-customCountryFlag"/>
	)
}