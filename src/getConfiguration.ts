import type { Configuration } from './types/Configuration.js'

export default function() {
	// @ts-ignore
	const webpackGlobalVaribleForConfiguration: Configuration = CONFIG

	return webpackGlobalVaribleForConfiguration
}