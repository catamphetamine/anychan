export default class MemoryStorage {
	data = {}
	get(key, defaultValue) {
		return this.data[key] || defaultValue
	}
	set(key, value) {
		this.data[key] = value
	}
	delete(key) {
		delete this.data[key]
	}
	// `clear()` is only used for tests.
	clear() {
		this.data = {}
	}
	forEach(func) {
		for (const key of Object.keys(this.data)) {
			func(key)
		}
	}
}