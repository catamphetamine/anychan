An alternative GUI for an imageboard (4chan, 8chan, 2ch).

Status: basic browsing works.

No longer in development.

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

See the [list of public CORS proxies](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347). Public CORS proxies introduce an artificial delay and may have other restrictions. For production a dedicated CORS proxy should be used.

## Chan

In `./configuration/configuration.default.json` there's `chan.origin` setting. This is the base URL for chan API.