import Settings from './utility/settings'
import { delayedDispatch } from './utility/dispatch'
import { migrate } from './utility/localStorage'

export default function() {
	// Apply user settings.
	Settings.apply({
		dispatch: delayedDispatch
	})
	// Migrate `localStorage`.
	migrate()
}