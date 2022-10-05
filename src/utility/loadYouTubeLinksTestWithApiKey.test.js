import YouTubeResourceTestWithApiKey from 'social-components/utility/post/YouTubeResourceTestWithApiKey.js'
import configuration from '../configuration.js'

describe('loadYouTubeLinks', () => {
	it('should load YouTube links with API key', async () => {
		const youTubeApiKey = configuration.youtubeApiKey
		if (youTubeApiKey) {
			const [a, b] = await YouTubeResourceTestWithApiKey(youTubeApiKey)
			expectToEqual(a, b)
		}
	})
})