An alternative GUI for an imageboard (4chan, 8chan, 2ch).

[Live Demo](https://catamphetamine.github.io/chanchan/)

This is a demo showcase project and it has only a minimal set of features:

  * Browsing.
  * No posting.
  * No new replies notifications.

## Screenshots

(may become outdated)

#### Board browsing

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-3605x2880.png)

<img src="https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-1024x818.png" width="800" height="639"/>

#### Post attachments

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-slideshow-1024x555.png" width="800" height="434"/>

## Install

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/chanchan.git
cd chanchan
npm install
```

## Develop

```
cd chanchan
npm run dev
```

Go to [`http://localhost:1234`](http://localhost:1234)

## Deploy

```
cd chanchan
npm run build
```

See the `build/assets` directory.

## Proxy

Chans (`2ch.hk`, `4chan.org`) don't allow calling their API from other websites by prohibiting [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for another website to be able to query chan API directly.

A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) is used in this demo project. Such public CORS proxy imposes several restrictions such as no support for "cookies" and also introduces an artifical delay (a couple of seconds) while querying chan API. There's also some [list of public CORS proxies](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347). For production deployment a dedicated CORS proxy should be used.

In `./configuration/default.json` there's `corsProxyUrl` setting — this is the CORS-proxy that will be used for querying chan API.

## Chan

This demo project currently supports `2ch.hk` chan.

<!-- and `4chan.org` chans.-->

### 2ch.hk

* [API (official docs)](https://2ch.hk/api/)
* [API (with examples)](https://github.com/catamphetamine/chanchan/blob/master/docs/2ch.hk/API.md)

### 4chan.org

* [API (official docs)](https://github.com/4chan/4chan-API)

<!--
## Configuration

By default the application uses `./configuration/default.json` settings.

To define custom settins create `configuration.json` file in the `./configuration` directory:

#### configuration.json

```js
{
	// (optional)
	"youtube": {
		"apiKey": "..."
	},
	...
}
```

Any settings in `configuration.json` will override the corresponding settings in `default.json`.
-->