import ResourceCache from 'social-components/utility/cache/ResourceCache.js'

import Storage from './storage/Storage.js'

export default new ResourceCache({
	storage: new Storage()
})