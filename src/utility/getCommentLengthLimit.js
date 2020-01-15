import { getViewportWidth } from 'webapp-frontend/src/utility/dom'
import configuration from '../configuration'

// The screen width at which the comments are at their full width.
// Should be equal to `$screen-m-min` in `webapp-frontend/src/styles/grid.mixins.css`.
const WIDE_SCREEN_MIN_WIDTH = 883

const commentLengthLimitFactor = typeof window === 'undefined' ? 1 : getCommentLengthLimitFactor(getViewportWidth())

function getCommentLengthLimitFactor(width) {
	return Math.min(1, width / WIDE_SCREEN_MIN_WIDTH)
}

/**
 * Returns `commentLengthLimit` depending on `mode` and screen width.
 * @param  {string} mode — One of: "board", "thread".
 * @return {number}
 */
export default function getCommentLengthLimit(mode) {
	return Math.round((mode === 'board' ? configuration.commentLengthLimitForThreadPreview : configuration.commentLengthLimit) * commentLengthLimitFactor)
}