import { ResourceCache } from 'social-components/cache'

import Storage from './storage/Storage.js'

export default new ResourceCache({
	storage: new Storage()
})