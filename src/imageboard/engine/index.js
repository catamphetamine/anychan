// This file only exists for multi-chan applications.

import Makaba from './makaba'
import FourChan from './4chan'
import LynxChan from './lynxchan'

export default function getEngine(engineId) {
	switch (engineId) {
		case 'makaba':
			return Makaba
		case '4chan':
		case 'vichan':
		case 'OpenIB':
			return FourChan
		case 'lynxchan':
			return LynxChan
		default:
			throw new RangeError(`Unknown chan engine: ${engineId}`)
	}
}