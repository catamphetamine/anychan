An alternative GUI for an imageboard (4chan, 8chan, 2ch).

No longer in development.

Status:

  * Basic board browsing.
  * No thread browsing.
  * No posting.
  * No new post notifications.

## Screenshots

#### Board browsing

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-3605x2880.png)

<img src="https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-1024x818.png" width="800" height="639"/>

#### Post attachments

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://raw.githubusercontent.com/catamphetamine/chanchan/master/docs/images/screenshot-slideshow-1024x555.png" width="800" height="434"/>

## Use

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/chanchan.git
cd chanchan
npm install
npm run dev
```

Go to [`http://localhost:1234`](http://localhost:1234)

## Proxy

In `./configuration/configuration.default.json` there's `proxy.template` setting. This is for CORS-proxying chan API.

Chans don't allow querying their API by a 3rd party (2ch.hk, 4chan.org), so a CORS proxy is required in order for a web browser to be able to query chan API directly.

See the [list of public CORS proxies](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347). Public CORS proxies introduce an artificial delay and may have other restrictions. For production a dedicated CORS proxy should be used.

## Chan

In `./configuration/configuration.default.json` there's `chan.origin` setting. This is the base URL for chan API.