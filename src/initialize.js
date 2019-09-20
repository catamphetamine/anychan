import Settings from './utility/settings'
import { delayedDispatch } from './utility/dispatch'

export default function() {
	// Apply user settings.
	Settings.apply({
		dispatch: delayedDispatch
	})
}