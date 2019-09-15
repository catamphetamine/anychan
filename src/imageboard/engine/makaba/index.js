import Engine from '../../Engine'

import parseBoardsResponse from './board/parseBoardsResponse'
import parseThreadsResponse from './thread/parseThreadsResponse'
import parseThreadResponse from './thread/parseThreadResponse'
import parseComment from './comment/parseComment'
import parseVoteResponse from './vote/parseVoteResponse'

import Board from '../../Board'
import Thread from '../../Thread'
import Comment from '../../Comment'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins'

export default class Makaba extends Engine {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentContentPlugins: PARSE_COMMENT_CONTENT_PLUGINS
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
			comments,
			board
		} = parseThreadsResponse(response)
		return threads.map((thread, i) => Thread(
			thread,
			[this.parseComment(comments[i], options, board)],
			this.getOptions(options),
			board
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
			comments.map(comment => this.parseComment(comment, options, board)),
			this.getOptions(options),
			board
		)
	}

	/**
	 * Creates a `Comment` from comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @param  {object} board
	 * @return {Comment}
	 */
	parseComment(comment, options, board) {
		options = this.getOptions(options)
		return Comment(parseComment(comment, options, board), options)
	}

	/**
	 * Parses "vote" API response.
	 * @param  {object} response
	 * @return {boolean} Returns `true` if the vote has been accepted.
	 */
	parseVoteResponse(response) {
		return parseVoteResponse(response)
	}
}