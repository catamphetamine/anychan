import type { DataSourceWithoutResources } from '@/types'

export default function addDataSourceManifestUrls(dataSources: DataSourceWithoutResources[]) {
	// Add URLs to `manifest.json` files.
	for (const dataSource of dataSources) {
		dataSource.manifestUrl = `/progressive-web-apps/${dataSource.id}/manifest.json`
	}
}
