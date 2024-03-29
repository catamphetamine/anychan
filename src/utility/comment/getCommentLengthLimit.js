import { getViewportWidth } from 'web-browser-window'

import getConfiguration from '../../configuration.js'

// The screen width at which the comments are at their full width.
// Is currently equal to `var(--Window-minWidth--m)`.
let WIDE_SCREEN_MIN_WIDTH

let commentLengthLimitFactor = 1
if (typeof window !== 'undefined') {
	const measure = () => {
		// // Didn't work for some weird reason:
		// WIDE_SCREEN_MIN_WIDTH = document.documentElement.style.getPropertyValue('--Window-minWidth--m')
		WIDE_SCREEN_MIN_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--Window-minWidth--m'))
		commentLengthLimitFactor = getCommentLengthLimitFactor(getViewportWidth())
	}
	window.addEventListener('resize', debounce(measure, 1000))
	measure()
}

function getCommentLengthLimitFactor(width) {
	return Math.min(1, width / WIDE_SCREEN_MIN_WIDTH)
}

/**
 * Returns `commentLengthLimit` depending on `mode` and screen width.
 * @param  {string} mode — One of: "channel", "thread".
 * @return {number}
 */
export default function getCommentLengthLimit(mode) {
	return Math.round((mode === 'channel' ? getConfiguration().commentLengthLimitForThreadPreview : getConfiguration().commentLengthLimit) * commentLengthLimitFactor)
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