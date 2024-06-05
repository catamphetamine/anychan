import type { DataSource } from '@/types'
import type { InlineContent } from 'social-components'

import parseLocationUrl from './parseLocationUrl.js'

import getChannelUrl from './getChannelUrl.js'
import getThreadUrl from './getThreadUrl.js'
import getCommentUrl from './getCommentUrl.js'

// Replaces links to the dataSource's website with in-app links.
// Example: "https://2ch.hk/a/" → "/a".
export default function transformDataSourceLink({
	url,
	content
}: {
	url: string,
	content: InlineContent
}, {
	dataSource
}: {
	dataSource: DataSource
}) {
	const location = parseLocationUrl(url)
	const pathname = normalizePathname(location.pathname)

	const channelLink = getChannelLink({
		channelUrlPattern: dataSource.channelUrl,
		pathname
	})

	if (channelLink) {
		return channelLink
	}

	const threadLink = getThreadLink({
		threadUrlPattern: dataSource.threadUrl,
		pathname
	})

	if (threadLink) {
		return threadLink
	}

	const commentLink = getCommentLink({
		commentUrlPattern: dataSource.commentUrl,
		pathname
	})

	if (commentLink) {
		return commentLink
	}

	return {
		url,
		content
	}
}

function getChannelLink({
	channelUrlPattern,
	pathname
}: {
	channelUrlPattern: string,
	pathname: string
}) {
	const channelUrlRegExp = new RegExp(
		'^' +
		escapeRegExpPattern(channelUrlPattern)
			.replace(escapeRegExpPattern('{channelId}'), URL_PATH_SEGMENT_CAPTURING_GROUP) +
		'$'
	)
	const match = pathname.match(channelUrlRegExp)
	if (match) {
		const channelId = match[1]
		return {
			url: getChannelUrl(channelId),
			content: `/${channelId}/`
		}
	}
}

function getThreadLink({
	threadUrlPattern,
	pathname
}: {
	threadUrlPattern: string,
	pathname: string
}) {
	const threadUrlRegExp = new RegExp(
		'^' +
		escapeRegExpPattern(threadUrlPattern)
			.replace(escapeRegExpPattern('{channelId}'), URL_PATH_SEGMENT_CAPTURING_GROUP)
			.replace(escapeRegExpPattern('{threadId}'), URL_PATH_SEGMENT_CAPTURING_GROUP) +
		'$'
	)
	const match = pathname.match(threadUrlRegExp)
	if (match) {
		const channelId = match[1]
		const threadId = match[2]
		return {
			url: getThreadUrl(channelId, Number(threadId)),
			content: `/${channelId}/${threadId}`
		}
	}
}

function getCommentLink({
	commentUrlPattern,
	pathname
}: {
	commentUrlPattern: string,
	pathname: string
}) {
	const commentUrlRegExp = new RegExp(
		'^' +
		escapeRegExpPattern(commentUrlPattern)
			.replace(escapeRegExpPattern('{channelId}'), URL_PATH_SEGMENT_CAPTURING_GROUP)
			.replace(escapeRegExpPattern('{threadId}'), URL_PATH_SEGMENT_CAPTURING_GROUP)
			.replace(escapeRegExpPattern('{commentId}'), URL_PATH_SEGMENT_CAPTURING_GROUP) +
		'$'
	)
	const match = pathname.match(commentUrlRegExp)
	if (match) {
		const channelId = match[1]
		const threadId = match[2]
		const commentId = match[3]
		return {
			url: getCommentUrl(channelId, Number(threadId), Number(commentId)),
			content: `/${channelId}/${threadId}#${commentId}`
		}
	}
}

const URL_PATH_SEGMENT_CAPTURING_GROUP = '([^\\/]+)'

const REG_EXP_SPECIAL_CHARACTERS_REG_EXP = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g')

function escapeRegExpPattern(string: string) {
	return string.replace(REG_EXP_SPECIAL_CHARACTERS_REG_EXP, '\\$&')
}

// Removes a trailing slash from a pathname.
// "/" → "/"
// "/a/" → "/a"
function normalizePathname(pathname: string) {
	if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
		return pathname.slice(0, pathname.length - 1)
	}
	return pathname
}