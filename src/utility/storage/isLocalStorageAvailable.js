import { LocalStorage } from 'web-browser-storage'

const localStorageAvailable = LocalStorage.isAvailable()

export default function isLocalStorageAvailable() {
	return localStorageAvailable
}