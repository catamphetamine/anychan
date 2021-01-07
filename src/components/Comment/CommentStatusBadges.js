import React from 'react'
import { useSelector } from 'react-redux'

import StarIcon from '../StarIcon'
import AnonymousCountryIcon from 'webapp-frontend/assets/images/icons/anonymous.svg'
import CountryFlag from 'webapp-frontend/src/components/CountryFlag'

import getMessages, { getCountryName } from '../../messages'
import { getAbsoluteUrl } from '../../provider'

import DislikeIcon from 'webapp-frontend/assets/images/icons/dislike.svg'
import DeceasedFaceIcon from 'webapp-frontend/assets/images/icons/deceased-face-rect.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import AnonymousIcon from '../../../assets/images/icons/anonymous.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'
import CommentRemovedIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square-removed.svg'

export default [
	{
		name: 'tracking',
		// icon: TrackedThreadStatusIcon,
		icon: StarIcon,
		title: ({ post, locale }) => {
			return getMessages(locale).trackedThreads.trackedThread
		},
		getIconProps: ({ post, locale }) => ({
			channelId: post.channelId,
			threadId: post.id
		}),
		condition: (post, { isTracked }) => post.mode === 'channel' && isTracked
	},
	{
		name: 'banned',
		icon: DeceasedFaceIcon,
		title: ({ post, locale }) => {
			if (post.authorBanReason) {
				return getMessages(locale).post.banned + getMessages(locale).post.bannedReason.replace('{0}', post.authorBanReason)
			}
			return getMessages(locale).post.banned
		},
		condition: post => post.authorBan
	},
	{
		name: 'removed',
		icon: CommentRemovedIcon,
		title: ({ post, locale }) => getMessages(locale).post.removed,
		condition: post => post.removed
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
			return ProviderSuppliedCountryFlagBadge
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
		title: ({ post, locale }) => getMessages(locale).threadBumpLimitReached,
		// On `2ch.hk` there can be "rolling" threads which aren't "sticky".
		condition: (post) => post.isBumpLimitReached || post.isOverBumpLimit
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

// function TrackedThreadStatusIcon({ channelId, threadId, ...rest }) {
// 	const isTracked = useSelector(({ trackedThreads }) => {
// 		const trackedThreadsIndex = trackedThreads.trackedThreadsIndex
// 		return trackedThreadsIndex[channelId] && trackedThreadsIndex[channelId].includes(threadId)
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

function ProviderSuppliedCountryFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<ProviderSuppliedCountryFlag {...rest}/>
		</div>
	)
}

function ProviderSuppliedCountryFlag({ name, url, ...rest }) {
	// let url = getProvider().countryFlagUrl
	// // Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// // https://2ch.hk/icons/logos/krym.gif
	// if (getProviderId() === '2ch' && country === 'krym') {
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