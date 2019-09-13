// This file only exists for multi-chan applications.

import getEngine from './engine/index'
import getChan from './chan/index'

export default function Chan(chanConfig, options) {
	if (typeof chanConfig === 'string') {
		const chanId = chanConfig
		const Chan = getChan(chanId)
		if (Chan) {
			return Chan(options)
		}
		throw new RangeError(`Unknown chan: ${chanId}`)
	}
	const Engine = getEngine(chanConfig.engine)
	return new Engine(chanConfig, options)
}