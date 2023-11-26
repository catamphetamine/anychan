import { setDefaultThemes } from './utility/settings/settingsDefaults.js'
import getDefaultThemes from './utility/getDefaultThemes.js'

export default function() {
	// Initialize the list of default themes.
	// Specifically, obtain `*.css` file URLs for the default themes.
	// The thing with those `*.css` file URLs is that they could only be obtained
	// in a bundler environment (Webpack in this case), and couldn't be obtained
	// in a Node.js environment because Node.js can't `import` `*.css` files
	// in contrast to a bundler like Webpack.
	// That's why initializing the list of default themes has to be done
	// in a special client-side-only module and not together with initializing
	// all other default settings that don't involve getting "resource" URLs.
	setDefaultThemes(getDefaultThemes())
}