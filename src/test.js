import { loadYouTubeLinksTestWithApiKey } from 'webapp-frontend/src/utility/post/loadYouTubeLinks.test'
import './utility/UserData.test'

import configuration from './configuration'

loadYouTubeLinksTestWithApiKey(configuration.youtube && configuration.youtube.apiKey)