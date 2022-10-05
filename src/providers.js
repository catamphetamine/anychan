// Exports a list of providers indexed by provider id.
// Also, sets `.icon` and `.logo` for each provider.

import PROVIDERS_LIST from '../providers/index.js'

// Create an index of all supported providers.
const PROVIDERS = PROVIDERS_LIST.reduce((index, provider) => {
	index[provider.id] = provider
	if (provider.aliases) {
		for (const alias of provider.aliases) {
			index[alias] = provider
		}
	}
	return index
}, {})

// Add "8kun" alias to "8ch".
PROVIDERS['8ch'].aliases = ['8kun']

// Exports an index of all supported providers.
export default PROVIDERS