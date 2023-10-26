import React from 'react'

import StarIcon from '../StarIcon.js'
import CountryFlag from 'frontend-lib/components/CountryFlag.js'

import getMessages, { getCountryName } from '../../messages/index.js'
import getAbsoluteUrl from '../../utility/dataSource/getAbsoluteUrl.js'

import AnonymousCountryIcon from 'frontend-lib/icons/anonymous-mask.svg'
import DislikeIcon from 'frontend-lib/icons/dislike.svg'
import DeceasedFaceIcon from 'frontend-lib/icons/deceased-face-rect.svg'
import PinIcon from 'frontend-lib/icons/pin.svg'
import InfinityIcon from 'frontend-lib/icons/infinity.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import AnonymousIconOutline from '../../../assets/images/icons/person-anonymous-slimmer-outline.svg'
import AnonymousIconFill from '../../../assets/images/icons/person-anonymous-slimmer-fill.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'
import CommentRemovedIcon from 'frontend-lib/icons/message-rounded-rect-square-removed.svg'

export default function getCommentFooterBadges({ dataSource, isOwn }) {
	return [
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
			condition: (post, { isSubscribedThreadInCatalog }) => post.isRootComment && isSubscribedThreadInCatalog
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
			icon: AnonymousIconOutline,
			title: ({ post, locale }) => getMessages(locale).post.threadAuthor,
			// If there are author IDs in the thread then "Original poster" is
			// gonna be the post author name instead of being a badge.
			condition: post => !isOwn && (post.viewingMode === 'thread' || post.viewingMode === 'channel-latest-comments') && post.authorIsThreadAuthor && !post.threadHasAuthorIds && !post.isRootComment
			// Instead of using `isOwn`, it could have used `post.own` flag.
			// The reason why specifically `isOwn` is used is because
			// when the user clicks "This is my comment" / "This is not my comment"
			// in `CommentMoreActions` menu, `isOwn` flag is updated and the component re-renders.
		},
		{
			name: 'own',
			icon: AnonymousIconOutline,
			title: ({ post, locale }) => post.threadId === post.id ? getMessages(locale).post.ownThread : getMessages(locale).post.ownComment,
			// If there are author IDs in the thread then "Original poster" is
			// gonna be the post author name instead of being a badge.
			condition: post => isOwn
			// Instead of using `isOwn`, it could have used `post.own` flag.
			// The reason why specifically `isOwn` is used is because
			// when the user clicks "This is my comment" / "This is not my comment"
			// in `CommentMoreActions` menu, `isOwn` flag is updated and the component re-renders.
		},
		{
			name: 'country',
			getIcon: ({ post, locale }) => {
				if (post.authorCountry) {
					return CountryFlagBadge
				}
				return DataSourceSuppliedCountryFlagBadge
			},
			getIconProps: ({ post, locale }) => {
				if (post.authorCountry) {
					return {
						country: post.authorCountry,
						name: post.authorCountry === 'ZZ' ?
							getMessages(locale).country.anonymous :
							getCountryName(post.authorCountry, locale),
						dataSourceId: dataSource.id,
						channelId: post.channelIdForCountryFlag
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
			condition: (post) => post.pinned
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
}

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

// There has been a request to show additional country flags on `4chan`.
// https://github.com/catamphetamine/anychan/issues/12
//
// * `GB-eng` — `XE` country at `4chan`'s `/sp/`
// * `GB-wls` — `XW` country at `4chan`'s `/sp/`
// * `GB-sct` — `XS` country at `4chan`'s `/sp/`
//
const ADDTIONAL_FLAGS_ON_4CHAN = [
	{
		code: 'XE',
		title: 'England',
		url: 'http://purecatamphetamine.github.io/country-flag-icons-other/3x2/GB-eng.svg'
	},
	{
		code: 'XW',
		title: 'Wales',
		url: 'http://purecatamphetamine.github.io/country-flag-icons-other/3x2/GB-wls.svg'
	},
	{
		code: 'XS',
		title: 'Scotland',
		url: 'http://purecatamphetamine.github.io/country-flag-icons-other/3x2/GB-sct.svg'
	}
]

function CountryFlag_({
	country,
	name,
	dataSourceId,
	channelId
}) {
	if (country === 'ZZ') {
		return (
			<AnonymousCountryIcon
				title={name}
				className="CountryFlag--anonymous"
			/>
		)
	}
	if (dataSourceId === '4chan' && channelId === 'sp') {
		for (const additionalFlag of ADDTIONAL_FLAGS_ON_4CHAN) {
			if (additionalFlag.code === country) {
				// Copied the markup from `frontend-lib/components/CountryFlag.js`.
				// Screen readers will pronounce `alt` but will skip `title` on images.
				return (
					<img
						alt={additionalFlag.title}
						title={additionalFlag.title}
						className="CountryFlag"
						src={additionalFlag.url}
					/>
				)
			}
		}
	}
	return (
		<CountryFlag
			country={country}
			name={name}
		/>
	)
}

function DataSourceSuppliedCountryFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<DataSourceSuppliedCountryFlag {...rest}/>
		</div>
	)
}

function DataSourceSuppliedCountryFlag({ name, url, ...rest }) {
	// let url = dataSource.countryFlagUrl
	// // Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// // https://2ch.hk/icons/logos/krym.gif
	// if (dataSource.id === '2ch' && country === 'krym') {
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