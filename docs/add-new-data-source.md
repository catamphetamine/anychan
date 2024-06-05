# Adding a new data source

To add a new data source:

* Create the data source folder:
  * If the new data source is an imageboard then the folder should be created in the `./dataSources/imageboards` directory.
	* If the new data source is not an imageboard then the folder should be created in the `./dataSources/non-imageboards` directory.
* In the data source folder:
  * Create `resources` subfolder in that folder.
	* Create `icon.png` file in the `resources` subfolder. It should be a `192 x 192` icon image.
	* Create `logo.png` or `logo.svg` file in the `resources` subfolder. The image should be square.
  * Create `app-icon-512.png` file in the `resources` subfolder. It will be used for [PWA](https://en.wikipedia.org/wiki/Progressive_web_app) support. The image should be `512 x 512` in size and should have ~15% margins on all sides.
  * Create `index.json` and `index.ts` files in that folder. The `*.json` file should contain the "JSON" part of the configuration. The `*.ts` file should contain the "javascript" part of the configuration.
	 * If the new data source is an imageboard, see any other imageboard-type data source as an example.
	 * If the new data source is not an imageboard, the file should also contain the "implementation" of the data source API functions. See the `example` data source as an example.
  * Create `index-with-resources.ts` files in that folder. The file should simply re-export `index.ts` file with the added "resources" such as an icon and a logo. See any data source as an example.
* Add the data source to the following files: `index.json.ts`, `index.ts` and `index-with-resources.ts`.
  * If the new data source is an imageboard, those files are located in `./dataSources/imageboards` directory.
  * If the new data source is not an imageboard, those files are located in `./dataSources/non-imageboards` directory.