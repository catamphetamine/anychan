import LocalStorage from './LocalStorage.js'
import MemoryStorage from './MemoryStorage.js'

import isLocalStorageAvailable from './isLocalStorageAvailable.js'

export default isLocalStorageAvailable() ? LocalStorage : MemoryStorage
