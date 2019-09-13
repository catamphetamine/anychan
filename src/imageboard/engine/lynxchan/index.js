import Engine from '../../Engine'

import parseBoardsResponse from './board/parseBoardsResponse'
import parseThreadsResponse from './thread/parseThreadsResponse'
import parseThreadResponse from './thread/parseThreadResponse'
import parseComment from './comment/parseComment'

import Board from '../../Board'
import Thread from '../../Thread'
import Comment from '../../Comment'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins'
import KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.kohlchan'

export default class LynxChan extends Engine {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentContentPlugins: getParseCommentContentPlugins(chanSettings.id)
		})
	}

	/**
	 * Parses "get boards list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Board[]}
	 */
	parseBoards(response, options) {
		return parseBoardsResponse(response, options).map(Board)
	}

	/**
	 * Parses "get threads list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreads(response, options) {
		const {
			threads,
			comments
		} = parseThreadsResponse(response)
		return threads.map((thread, i) => Thread(
			thread,
			[this.parseComment(comments[i], { ...options, threadId: thread.id })],
			this.getOptions(options)
		))
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread}
	 */
	parseThread(response, options) {
		const {
			thread,
			comments,
			board
		} = parseThreadResponse(response)
		return Thread(
			thread,
			comments.map(comment => this.parseComment(comment, { ...options, threadId: thread.id })),
			this.getOptions(options),
			board
		)
	}

	/**
	 * Creates a `Comment` from comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @return {Comment}
	 */
	parseComment(comment, options) {
		options = this.getOptions(options)
		return Comment(parseComment(comment, options), options)
	}
}

function getParseCommentContentPlugins(chan) {
	switch (chan) {
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS
		default:
			return PARSE_COMMENT_CONTENT_PLUGINS
	}
}