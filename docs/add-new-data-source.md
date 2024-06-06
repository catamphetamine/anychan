# Adding a new data source

To add a new data source:

* Create the data source folder:
  * If the new data source is an imageboard then the folder should be created in the `./dataSources/imageboards` directory.
  * If the new data source is not an imageboard then the folder should be created in the `./dataSources/non-imageboards` directory.

* In the data source folder:
  * Create `resources` subfolder in that folder.
	* Create `icon.png` file in the `resources` subfolder.
    * It should be a `192 x 192` icon image.
	* Create `logo.png` or `logo.svg` file in the `resources` subfolder.
    * The image should be square.
  * Create `app-icon-512.png` file in the `resources` subfolder.
    * It will be used for [PWA](https://en.wikipedia.org/wiki/Progressive_web_app) support.
    * The image should be `512 x 512` in size and should have ~15% margins on all sides.
  * Create `index.json` and `index.ts` files in that folder.
    * The `*.json` file should contain the "JSON" part of the configuration.
    * The `*.ts` file should contain the "javascript" part of the configuration.
    * If the new data source is an imageboard, see any other imageboard-type data source as an example.
    * If the new data source is not an imageboard, the file should also contain an ["adapter"](#adapter) for the data source API.
  * Create `index-with-resources.ts` files in that folder.
    * The file should simply re-export `index.ts` file with the added "resources" such as an icon and a logo.
    * See any data source as an example.

* Add the data source to the following files: `index.json.ts`, `index.ts` and `index-with-resources.ts`.
  * If the new data source is an imageboard, those files are located in `./dataSources/imageboards` directory.
  * If the new data source is not an imageboard, those files are located in `./dataSources/non-imageboards` directory.

## Example

See [example](https://gitlab.com/catamphetamine/anychan/-/tree/master/dataSources/non-imageboards/example) data source.

## Adapter

In order for this application to be able to "talk" to a data source API, an "adapter" is required. Such "adapter" would translate the application's request for certain data or certain action from the application's "language" to the data source API's "language", and vice versa.

Implementation-wise, an "adapter" comes in the form of a pre-defined set of functions that're listed under the `api` key of [`DataSource`](https://gitlab.com/catamphetamine/anychan/-/blob/master/src/types/DataSource.ts) type. Some of those functions are optional, other ones are required.

For example, there's an `api.getThread()` function that receives parameters such as `channelId` and `threadId` and is expected to return an object with a `thread` property which should contain the thread's data, including a list of its comments.

### API functions

Each API function receives parameters:

* `proxyUrl: string | null` — CORS proxy URL.
  * Should be passed to `createHttpRequestFunction({ proxyUrl })` to create a "send HTTP request" function. If `proxyUrl` is passed to that function, it will proxy all HTTP requests through that proxy. Otherwise, it won't use any proxy when sending HTTP requests.

"Real-only" API functions additionally recieve parameters:

* `locale: string` — The language that is currently selected in the application.
  * Even though the variable name is `locale`, I'd call it more of a "language" rather than a "locale" because it doesn't contain the "region" part: it's just "en" rather than "en-US".
  * The user's locale could be used to customize API response for a certain language. For example, if the API replaces YouTube links with YouTube video titles, it could use the locale to choose between the available titles in different languages.
  * Examples: `"en"`, `"ru"`, etc.

* `originalDomain: string | null` — If the application runs on one of the "original" domains of the data source, the `originalDomain` is gonna be that "original" domain.
  * For example, if this application was running somewhere at `https://4chan.org/anychan` then the `originalDomain` would be `"4chan.org"`.
  * A data source "adapter" could then use this `originalDomain` parameter when deciding whether it should convert any relative URLs to absolute ones.
  * For example, if `originalDomain` was `"4chan.org"` and images were also hosted at `4chan.org` then those image URLs could be left relative like `"/images/image-12345.jpg"`. In other cases, any relative URLs should be manually converted to absolute ones like `"https://4chan.org/images/image-12345.jpg"` by the data source "adapter".

### Types

Types should be imported from `@/types`.

```js
import type { GetThreadParameters, GetThreadResult, ThreadFromDataSource } from '@/types'

export async function getThread({
  channelId,
  threadId
}: GetThreadParameters): Promise<GetThreadResult> {
  const thread: ThreadFromDataSource = ...
  return { thread }
}
```

### HTTP requests

To make HTTP requests to the data source API, use [`createHttpRequestFunction({ proxyUrl })`](https://gitlab.com/catamphetamine/anychan/-/tree/master/src/api/utility/createHttpRequestFunction.ts):

```js
import type { GetThreadParameters, GetThreadResult } from '@/types'

// Creates a "send HTTP request" function.
import createHttpRequestFunction from '../../../../src/api/utility/createHttpRequestFunction.js'

// Returns thread data.
export async function getThread({
	channelId,
  threadId,
  proxyUrl
}: GetThreadParameters): Promise<GetThreadResult> {
  const sendHttpRequest = createHttpRequestFunction({ proxyUrl })
  const result = await sendHttpRequest({
    method: 'GET',
    url: `https://some-data-source.com/api/channels/${channelId}/threads/${threadId}`,
    // query: { ... }
    // body: { ... }
    // headers: { ... }
    // cookies: { ... }
  })
  return transformResult(result)
}
```

### Relative URLs

When the application is not running on the same domain as the data source, any relative URLs should be converted into absolute ones, otherwise those URLs wouldn't resolve.

For example, if `https://example.com/api` API returns image URLs like `"/images/image-12345.jpg"`, those relative URLs should be converted to absolute ones like `"https://example.com/images/image-12345.jpg"`, unless the application runs on the `example.com` domain in which case relative URLs are fine.

To find out whether the application runs on the same domain as the data source, every API function receives an `originalDomain` parameter.
* If that parameter is `null` then it means that the application is not running on the same domain and should convert any relative URLs to aboslute ones.
* If that parameter is not `null` then it's the name of the domain it is running at. In that case, the data source "adapter" could see for itself whether any relative URLs should be converted to absolute ones or not.

To convert a relative URL to an absolute one, one could use [`getAbsoluteUrl(url)`](https://gitlab.com/catamphetamine/anychan/-/tree/master/src/api/utility/getAbsoluteUrl.ts) function:

```js
import getAbsoluteUrl from '../../../../src/api/utility/getAbsoluteUrl.js'

// For a relative URL, it converts it to an absolute one.
getAbsoluteUrl('/path/to/file', 'example.com') === 'https://example.com/path/to/file'

// For an absolute URL, it doesn't do anything and returns the URL as is.
getAbsoluteUrl('https://example.com/path/to/file', 'example.com') === 'https://example.com/path/to/file'
```

### Errors

There's a pre-defined [list](https://gitlab.com/catamphetamine/anychan/-/blob/master/src/api/errors/index.ts) of errors that the application handles in a certain way. For that reason, when throwing an error from a data source "adapter", prefer the errors from that pre-defined list. If some types of errors aren't present there, create an issue in the application repo in order to potentially add those to the list.

```js
import {
  ChannelNotFoundError,
  ThreadNotFoundError
} from "../../../../src/api/errors/index.js"
```

### Content

When the application calls API "adapter" functions like `getThreads()` or `getThread()`, it expects, among other things, to receive the comments' `content` which should be of type [`Content`](https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md).