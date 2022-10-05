import { Lock } from 'web-browser-tab'

import { BASE_PREFIX } from './storage/getStoragePrefix.js'

export default class Lock_ extends Lock {
	constructor(name, parameters) {
		super(BASE_PREFIX + name, parameters)
	}
}