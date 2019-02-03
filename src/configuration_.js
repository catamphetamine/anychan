import configuration from '../configuration'

// In order for any configuration parameter to be accessible
// on client side it has to be manually copied from `configuration` here.
// This is to prevent accidental leakage of server-side-only keys, etc.
export default {
	// A list of public CORS proxies:
	// https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
	corsProxyUrl: configuration.corsProxyUrl,
	// https://console.developers.google.com/apis/credentials
	youTubeApiKey: configuration.youtube && configuration.youtube.apiKey,
	defaultChan: configuration.defaultChan
}