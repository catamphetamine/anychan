import { addBasePath } from './getBasePath.js'

import DefaultThemeUrl from '../styles/theme/default.css'
import GrayThemeUrl from '../styles/theme/gray.css'
import NeonGenesisEvangelionThemeUrl from '../styles/theme/neon-genesis-evangelion.css'

let defaultThemes

export default function getDefaultThemes() {
	if (!defaultThemes) {
		defaultThemes = createDefaultThemes()
	}
	return defaultThemes
}

// `addBasePath()` result depends on the current data source,
// and the current data source is not known beforhand
// and is determined either from the current URL
// or from the configuration file.
// That means that the default themes list can't be created
// before the current data source has been set, which means that
// the default themes list should be created in a later function call
// rather than immediately at the top level of the file.
function createDefaultThemes() {
	return [
		{
			id: 'default',
			name: 'Default',
			url: addBasePath(DefaultThemeUrl)
		},
		{
			id: 'gray',
			name: 'Gray',
			url: addBasePath(GrayThemeUrl)
		},
		{
			id: 'neon-genesis-evangelion',
			name: 'Neon Genesis Evangelion',
			url: addBasePath(NeonGenesisEvangelionThemeUrl)
		}
	]
}