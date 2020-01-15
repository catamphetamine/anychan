import { getViewportWidth } from 'webapp-frontend/src/utility/dom'
import configuration from '../configuration'

// The screen width at which the comments are at their full width.
// Should be equal to `$screen-m-min` in `webapp-frontend/src/styles/grid.mixins.css`.
const WIDE_SCREEN_MIN_WIDTH = 883

let commentLengthLimitFactor = 1
if (typeof window !== 'undefined') {
	const measure = () => commentLengthLimitFactor = getCommentLengthLimitFactor(getViewportWidth())
	window.addEventListener('resize', debounce(measure, 1000))
	measure()
}

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

/**
 * Same as `lodash`'s `debounce()` for functions with no arguments.
 * @param  {function} func
 * @param  {number} interval
 * @return {function}
 */
function debounce(func, interval) {
	let timeout
	return function() {
		clearTimeout(timeout)
		timeout = setTimeout(func, interval)
	}
}