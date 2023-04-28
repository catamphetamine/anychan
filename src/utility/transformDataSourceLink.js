import {
	getChannelUrlPattern,
	getChannelUrl
} from '../dataSource.js'

import parseLocationUrl from './parseLocationUrl.js'
import getUrl from './getUrl.js'

// Replaces links to the dataSource's website with in-app links.
// Example: "https://2ch.hk/a/" → "/a".
export default function transformDataSourceLink({ url, content }, { dataSource }) {
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

function getChannelLink({ channelUrlPattern, pathname }) {
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
			url: getUrl(channelId),
			content: `/${channelId}/`
		}
	}
}

function getThreadLink({ threadUrlPattern, pathname }) {
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
			url: getUrl(channelId, threadId),
			content: `/${channelId}/${threadId}`
		}
	}
}

function getCommentLink({ commentUrlPattern, pathname }) {
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
			url: getUrl(channelId, threadId, commentId),
			content: `/${channelId}/${threadId}#${commentId}`
		}
	}
}

const URL_PATH_SEGMENT_CAPTURING_GROUP = '([^\\/]+)'

const REG_EXP_SPECIAL_CHARACTERS_REG_EXP = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g')

function escapeRegExpPattern(string) {
	return string.replace(REG_EXP_SPECIAL_CHARACTERS_REG_EXP, '\\$&')
}

// Removes a trailing slash from a pathname.
// "/" → "/"
// "/a/" → "/a"
function normalizePathname(pathname) {
	if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
		return pathname.slice(0, pathname.length - 1)
	}
	return pathname
}