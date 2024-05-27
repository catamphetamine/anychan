import type { DataSource } from '@/types'

import DATA_SOURCES_LIST from '../dataSources/index.js'

export default function addDataSourceManifestUrls() {
	addDataSourceManifestUrls_(DATA_SOURCES_LIST)
}

function addDataSourceManifestUrls_(DATA_SOURCES_LIST: DataSource[]) {
	// Add URLs to `manifest.json` files.
	for (const dataSource of DATA_SOURCES_LIST) {
		dataSource.manifestUrl = `/progressive-web-apps/${dataSource.id}/manifest.json`
	}
}
