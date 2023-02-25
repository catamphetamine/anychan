const PAGE_LOAD_TIMEOUT = 1000

let consoleWarnHasBeenInstrumented = false

export default function suppressVirtualScrollerDevModePageLoadWarnings() {
	if (consoleWarnHasBeenInstrumented) {
		return
	}
	// `virtual-scroller` might produce false warnings about items changing their height unexpectedly.
	// https://gitlab.com/catamphetamine/virtual-scroller/#item-index-n-height-changed-unexpectedly-warning-on-page-load-in-dev-mode
	// That might be the case because Webpack hasn't yet loaded the styles by the time `virtual-scroller`
	// performs its initial items measurement.
	// To clear the console from such false warnings, a "page load timeout" is introduced in development mode.
	if (process.env.NODE_ENV !== 'production') {
		consoleWarnHasBeenInstrumented = true
		const originalConsoleWarn = console.warn
		const startedAt = Date.now()
		let muteVirtualScrollerUnexpectedHeightChangeWarnings = true
		console.warn = (...args) => {
			if (muteVirtualScrollerUnexpectedHeightChangeWarnings) {
				if (Date.now() - startedAt < PAGE_LOAD_TIMEOUT) {
					if (args[0] === '[virtual-scroller]' && args[1] === 'Item index' && args[3] === 'height changed unexpectedly: it was') {
						// Mute the warning.
						console.log('(muted `virtual-scroller` warning because the page hasn\'t loaded yet)')
						return
					}
				} else {
					muteVirtualScrollerUnexpectedHeightChangeWarnings = false
				}
			}
			return originalConsoleWarn(...args)
		}
	}
}