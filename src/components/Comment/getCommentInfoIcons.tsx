import type { Comment, Messages, Locale, DataSource, ChannelId } from '@/types'
import type { CommentInfoIcon } from './CommentFooter.js'

import * as React from 'react'

import StarIcon from '../StarIcon.js'
import CountryFlag from 'frontend-lib/components/CountryFlag.js'

import getCountryName from '../../messages/getCountryName.js'
import getUrlAtDataSourceDomain from '../../utility/dataSource/getUrlAtDataSourceDomain.js'

import useDataSource from '../../hooks/useDataSource.js'

import AnonymousCountryIcon from 'frontend-lib/icons/anonymous-mask.svg'
import DislikeIcon from 'frontend-lib/icons/dislike.svg'
import DeceasedFaceIcon from 'frontend-lib/icons/deceased-face-rect.svg'
import PinIcon from 'frontend-lib/icons/pin.svg'
import InfinityIcon from 'frontend-lib/icons/infinity.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import ReplyIcon from 'frontend-lib/icons/reply.svg'
import AnonymousIconOutline from '../../../assets/images/icons/person-anonymous-slimmer-outline.svg'
import AnonymousIconFill from '../../../assets/images/icons/person-anonymous-slimmer-fill.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sailing-boat-sinking.svg'
import AnonymousPersonsConversationIcon from '../../../assets/images/icons/anonymous-persons-conversation.svg'
import CommentRemovedIcon from 'frontend-lib/icons/message-rounded-rect-square-removed.svg'

export default function getCommentInfoIcons({
	dataSource,
	isOwnComment
}: {
	dataSource: DataSource,
	isOwnComment?: boolean
}): CommentInfoIcon[] {
	return [
		{
			name: 'subscribed',
			// icon: SubscribedThreadStatusIcon,
			icon: StarIcon,
			title: ({ post, messages }) => {
				return messages.subscribedThreads.subscribedThread
			},
			getIconProps: ({ post }) => ({
				channelId: post.channelId,
				threadId: post.id
			}),
			condition: (post, { isSubscribedThreadInCatalog }) => post.isRootComment && isSubscribedThreadInCatalog
		},
		{
			name: 'banned',
			icon: DeceasedFaceIcon,
			title: ({ post, messages }) => {
				if (post.authorBanReason) {
					return messages.post.banned + messages.post.bannedReason.replace('{reason}', post.authorBanReason)
				}
				return messages.post.banned
			},
			condition: post => post.authorBan
		},
		{
			name: 'removed',
			icon: CommentRemovedIcon,
			title: ({ post, messages }) => messages.post.removed,
			condition: post => post.removed
		},
		{
			name: 'sage',
			icon: DislikeIcon,
			title: ({ post }) => 'Sage',
			condition: post => post.sage
		},
		{
			name: 'original-poster',
			icon: AnonymousIconOutline,
			title: ({ post, messages }) => messages.post.threadAuthor,
			// If there are author IDs in the thread then "Original poster" is
			// gonna be the post author name instead of being a badge.
			condition: post => !isOwnComment && (post.viewingMode === 'thread' || post.viewingMode === 'channel-latest-comments') && post.authorIsThreadAuthor && !post.threadHasAuthorIds && !post.isRootComment
			// Instead of using `isOwnComment`, it could have used `post.own` flag.
			// The reason why specifically `isOwnComment` is used is because
			// when the user clicks "This is my comment" / "This is not my comment"
			// in `CommentMoreActions` menu, `isOwnComment` flag is updated and the component re-renders.
		},
		{
			name: 'ownComment',
			icon: AnonymousIconOutline,
			title: ({ post, messages }) => post.isRootComment ? messages.post.ownThread : messages.post.ownComment,
			// If there are author IDs in the thread then "Original poster" is
			// gonna be the post author name instead of being a badge.
			condition: post => isOwnComment
			// Instead of using `isOwnComment`, it could have used `post.own` flag.
			// The reason why specifically `isOwnComment` is used is because
			// when the user clicks "This is my comment" / "This is not my comment"
			// in `CommentMoreActions` menu, `isOwnComment` flag is updated and the component re-renders.
		},
		{
			name: 'replyToOwnComment',
			icon: AnonymousPersonsConversationIcon,
			title: ({ messages }) => messages.post.replyToOwnComment,
			// If there are author IDs in the thread then "Original poster" is
			// gonna be the post author name instead of being a badge.
			condition: post => !post.own && post.isReplyToOwnComment
			// Instead of using `isOwnComment`, it could have used `post.own` flag.
			// The reason why specifically `isOwnComment` is used is because
			// when the user clicks "This is my comment" / "This is not my comment"
			// in `CommentMoreActions` menu, `isOwnComment` flag is updated and the component re-renders.
		},
		{
			name: 'country',
			getIcon: ({ post }) => {
				if (post.authorCountry) {
					return CountryFlagBadge
				}
				return DataSourceSuppliedCountryFlagBadge
			},
			getIconProps: ({ post, messages, locale }) => {
				if (post.authorCountry) {
					return {
						country: post.authorCountry,
						name: post.authorCountry === 'ZZ' ?
							messages.country.anonymous :
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
			title: ({ post, messages, locale }) => {
				if (post.authorCountry) {
					return post.authorCountry === 'ZZ' ?
						messages.country.anonymous :
						getCountryName(post.authorCountry, locale)
				}
				return post.authorBadgeName
			},
			condition: post => Boolean(post.authorCountry || post.authorBadgeName)
		},
		{
			name: 'bump-limit',
			icon: SinkingBoatIcon,
			title: ({ post, messages }) => messages.threadBumpLimitReached,
			// On `2ch.hk` there can be "trimming" threads which aren't "sticky".
			condition: (post) => (!post.archived && post.bumpLimitReached) || post.isOverBumpLimit
		},
		{
			name: 'sticky',
			icon: PinIcon,
			title: ({ post, messages }) => messages.post.sticky,
			condition: (post) => post.pinned
		},
		{
			name: 'trimming',
			icon: InfinityIcon,
			title: ({ post, messages }) => messages.post.trimming,
			condition: (post) => post.trimming
		},
		{
			name: 'closed',
			icon: LockIcon,
			title: ({ post, messages }) => messages.post.closed,
			condition: (post) => post.locked
		},
		{
			name: 'archived',
			icon: BoxIcon,
			title: ({ post, messages }) => messages.post.archived,
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

function CountryFlagBadge({ className, ...rest }: CountryFlagBadgeProps) {
	return (
		<div className={className}>
			<CountryFlagOrOtherFlag {...rest}/>
		</div>
	)
}

type CountryFlagBadgeProps = {
	className?: string
} & CountryFlagOrOtherFlagProps

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

function CountryFlagOrOtherFlag({
	country,
	name,
	dataSourceId,
	channelId
}: CountryFlagOrOtherFlagProps) {
	if (country === 'ZZ') {
		return (
			<AnonymousCountryIcon
				// @ts-expect-error
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

type CountryFlagOrOtherFlagProps = {
	country: string,
	name: string,
	dataSourceId: DataSource['id'],
	channelId: ChannelId
} & DataSourceSuppliedCountryFlagBadgeProps

function DataSourceSuppliedCountryFlagBadge({
	className,
	...rest
}: DataSourceSuppliedCountryFlagBadgeProps) {
	return (
		<div className={className}>
			<DataSourceSuppliedCountryFlag {...rest}/>
		</div>
	)
}

type DataSourceSuppliedCountryFlagBadgeProps = {
	className?: string
} & DataSourceSuppliedCountryFlagProps

function DataSourceSuppliedCountryFlag({
	name,
	url,
	...rest
}: DataSourceSuppliedCountryFlagProps) {
	const dataSource = useDataSource()

	// let url = dataSource.countryFlagUrl
	// // Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// // https://2ch.hk/icons/logos/krym.gif
	// if (dataSource.id === '2ch' && country === 'krym') {
	// 	url = url.replace(/\.png$/, '.gif')
	// }

	// Transform relative URL to an absolute one.
	url = getUrlAtDataSourceDomain(url, { dataSource })

	// src={url.replace('{country}', country)}
	return (
		<img
			{...rest}
			alt={name}
			src={url}
			className="CommentInfoIcon-customCountryFlag"
		/>
	)
}

interface DataSourceSuppliedCountryFlagProps {
	name: string,
	url: string
}