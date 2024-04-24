import { YouTubeResourceTestWithApiKey } from 'social-components/resource'
import getConfiguration from '../getConfiguration.ts'

describe('loadYouTubeLinks', () => {
	it('should load YouTube links with API key', async () => {
		const youTubeApiKey = getConfiguration().youtubeApiKey
		if (youTubeApiKey) {
			const [a, b] = await YouTubeResourceTestWithApiKey(youTubeApiKey)
			expectToEqual(a, b)
		}
	})
})