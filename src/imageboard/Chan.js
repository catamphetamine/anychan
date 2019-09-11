// This file only exists for multi-chan applications.

import getEngine from './engine/index'
import getChan from './chan/index'

export default function Chan(chanConfig, options) {
	const Chan = getChan(chanConfig.id)
	if (Chan) {
		return Chan(options)
	}
	if (chanConfig.engine) {
		const Engine = getEngine(chanConfig.engine)
		return new Engine(chanConfig, options)
	}
	throw new RangeError(`Unknown chan: ${chanConfig.id}`)
}