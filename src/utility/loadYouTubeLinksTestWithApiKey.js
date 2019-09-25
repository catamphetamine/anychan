import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import loadYouTubeLinksTestWithApiKey from 'social-components/commonjs/utility/post/loadYouTubeLinksTestWithApiKey'
import configuration from '../configuration'

describe('loadYouTubeLinks', () => {
	it('should load YouTube links with API key', async () => {
		const youTubeApiKey = configuration.youtube && configuration.youtube.apiKey
		if (youTubeApiKey) {
			const [a, b] = await loadYouTubeLinksTestWithApiKey(youTubeApiKey)
			expectToEqual(a, b)
		}
	})
})