import { DataSourceDefinition } from "@/types"

import api from './api/index.js'

import ExampleDataSourceConfig from './index.json' assert { type: 'json' }

const ExampleDataSource: DataSourceDefinition = {
	...ExampleDataSourceConfig,

	supportsFeature: () => {
		// Doesn't support any fancy features. Just the basic stuff.
		return false
	},

	// This flag is set to `true` to prevent the application from converting relative attachment URLs
	// like `/attachment1.svg` to absolute ones like `https://example.com/attachment1.svg`.
	// The reason is that those `*.svg` files are "fake" and therefore those URLs are meant to stay relative.
	keepRelativeAttachmentUrls: true,

	// Data source API.
	api
}

export default ExampleDataSource