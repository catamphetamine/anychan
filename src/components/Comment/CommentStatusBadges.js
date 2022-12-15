import React from 'react'

import StarIcon from '../StarIcon.js'
import CountryFlag from 'frontend-lib/components/CountryFlag.js'

import getMessages, { getCountryName } from '../../messages/index.js'
import { getAbsoluteUrl } from '../../provider.js'

import AnonymousCountryIcon from 'frontend-lib/icons/anonymous.svg'
import DislikeIcon from 'frontend-lib/icons/dislike.svg'
import DeceasedFaceIcon from 'frontend-lib/icons/deceased-face-rect.svg'
import PinIcon from 'frontend-lib/icons/pin.svg'
import InfinityIcon from 'frontend-lib/icons/infinity.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import AnonymousIcon from '../../../assets/images/icons/anonymous.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'
import CommentRemovedIcon from 'frontend-lib/icons/message-rounded-rect-square-removed.svg'

export default [
	{
		name: 'subscribed',
		// icon: SubscribedThreadStatusIcon,
		icon: StarIcon,
		title: ({ post, locale }) => {
			return getMessages(locale).subscribedThreads.subscribedThread
		},
		getIconProps: ({ post, locale }) => ({
			channelId: post.channelId,
			threadId: post.id
		}),
		condition: (post, { isSubscribedThreadInCatalog }) => isSubscribedThreadInCatalog
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
		condition: post => post.sage
	},
	{
		name: 'original-poster',
		icon: AnonymousIcon,
		title: ({ post, locale }) => getMessages(locale).post.threadAuthor,
		// If there are author IDs in the thread then "Original poster" is
		// gonna be the post author name instead of being a badge.
		condition: post => (post.viewingMode === 'thread' || post.viewingMode === 'channel-latest-comments') && post.authorIsThreadAuthor && !post.threadHasAuthorIds && !post.isRootComment
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
		// On `2ch.hk` there can be "trimming" threads which aren't "sticky".
		condition: (post) => (!post.archived && post.bumpLimitReached) || post.isOverBumpLimit
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: ({ post, locale }) => getMessages(locale).post.sticky,
		condition: (post) => post.onTop
	},
	{
		name: 'trimming',
		icon: InfinityIcon,
		title: ({ post, locale }) => getMessages(locale).post.trimming,
		condition: (post) => post.trimming
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: ({ post, locale }) => getMessages(locale).post.closed,
		condition: (post) => post.locked
	},
	{
		name: 'archived',
		icon: BoxIcon,
		title: ({ post, locale }) => getMessages(locale).post.archived,
		condition: (post) => post.archived
	}
]

// function SubscribedThreadStatusIcon({ channelId, threadId, ...rest }) {
// 	const isSubscribedThreadInCatalog = ...
// 	if (isSubscribedThreadInCatalog) {
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