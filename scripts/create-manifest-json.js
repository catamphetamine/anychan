import fs from 'fs-extra'

import DATA_SOURCES from '../dataSources/index.js'

// const manifestTemplate = fs.readFileSync('./assets/manifest.template.json', 'utf8');

const manifestTemplate = {
	"name": "{title}",
	"start_url": "{url}",
	"icons": [
		{
			"src": "{largeIconUrl}",
			"type": "{largeIconType}",
			"sizes": "{largeIconSize}"
		}
	]
}

for (const dataSource of DATA_SOURCES) {
	const manifestTemplateContent = JSON.stringify(manifestTemplate, null, 2)

	const manifestContent = manifestTemplateContent
		.replaceAll('{title}', dataSource.title)
		.replaceAll('{url}', `/${dataSource.id}`)
		.replaceAll('{largeIconUrl}', './app-icon-512.png')
		.replaceAll('{largeIconType}', 'image/png')
		.replaceAll('{largeIconSize}', '512x512');

	fs.copySync(`./dataSources/imageboards/${dataSource.id}/app-icon-512.png`, `./build/progressive-web-apps/${dataSource.id}/app-icon-512.png`);

	fs.outputFileSync(`./build/progressive-web-apps/${dataSource.id}/manifest.json`, manifestContent);
}