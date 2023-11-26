# CORS Proxy

## Rationale

None of the imageboards — `4chan.org`, `8kun.top`, `2ch.hk`, etc — will allow accessing their APIs in a web browser from outside of those websites themselves. In other words, in a web browser, only `4chan.org` will be able to access `4chan.org`'s API. That is called blocking of [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS) HTTP requests. A "CORS proxy" is required to bypass that restriction.

## Requirements

This application imposes additional requirements on a CORS Proxy in order for it to be fully functional:

* When receiving an HTTP request with `X-Set-Cookies: true` header, in the HTTP response it must set `X-Set-Cookies` header value to a `JSON.stringify()`-ed array of all `Set-Cookie` headers in the HTTP response, if there're any. That's because web browsers don't allow reading `Set-Cookie` response header directly, so it has to be duplicated under a different name in response in order to be able to read those cookies.

* When receiving an HTTP request with `X-Cookie` header, in the HTTP request it must set `Cookie` header to the same value. That's because web browsers don't allow writing to `Cookie` request header directly, so it has to be duplicated under a different name in request in order to be able to send custom cookies.

* When receiving an HTTP request with `X-Follow-Redirect: false` header, it must not automatically "follow" any redirects.

* When receiving an HTTP request with `X-Follow-Redirect: true` header, it must automatically "follow" any redirects.

* When automatically "following" a chain of redirects, it must concatenate all `Set-Cookie` response headers in the chain and output the result in `Set-Cookie` header of the final response.

* When automatically "following" a chain of redirects, it must return the final URL in the `X-Final-URL` HTTP response header.

* When receiving an HTTP request with `X-Redirect-Status` header, it must replace the original HTTP response status code with the value of `X-Redirect-Status` HTTP request header, and also set `X-Redirect-Status` HTTP response header value to the original HTTP response status code.

A CORS proxy fitting these requirements is [`cors-proxy-node`](https://www.npmjs.com/package/cors-proxy-node).

## Demo

The demo website uses a [`cors-proxy-node`](https://www.npmjs.com/package/cors-proxy-node) CORS Proxy running free in a [Vercel](https://vercel.com/) Node.js container.

## Custom

<!--
A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) can be used for development/testing. Such public CORS proxy imposes several restrictions such as no support for "cookies" and rate limiting. For production, a dedicated CORS proxy should be set up.

A free 1-year [AWS EC2](https://aws.amazon.com/ec2/) "micro" server can be set up as a proxy server. It won't work for all imageboards though: for example, `4chan.org` uses CloudFlare CDN, so it will return `403 Forbidden` in response to any HTTP request received from such AWS EC2 proxy. That's because CloudFlare blocks all traffic from AWS EC2 (I guess because it could be easily set up for a DDoS attack).

[Heroku](https://www.heroku.com/) seems to work with CloudFlare without any issues. It has [another issue](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true#scale-the-app) though: a free instance will sleep after a half hour of inactivity (if it doesn’t receive any traffic). This causes a delay of a few seconds for the first request upon waking. Subsequent requests will perform normally.
-->

One could also run their own CORS Proxy. The reasons would be:

* The "demo" free CORS Proxy may stop functioning at some point for whatever reason.
* Running your own CORS Proxy might be faster and more stable than using the "demo" one:
  * "demo" proxy runs on a free hosting plan which has its limitations in terms of performance, throughput, rate limiting, etc.
  * "demo" proxy runs somewhere at a remote geographic location, and running a proxy on a local machine will be a bit faster because that would eliminate the "ping" delay.

The instructions would be:

* [An example of setting up a free CORS proxy on Vercel](https://gitlab.com/catamphetamine/anychan/tree/master/docs/proxy/CORS-PROXY-VERCEL.md).

* [An example of setting up a free 1-year AWS EC2 CORS proxy](https://gitlab.com/catamphetamine/anychan/tree/master/docs/proxy/CORS-PROXY-AWS-EC2.md).

## Hosting

Not every hosting provider would work well for a CORS Proxy:

* The IP address ranges of popular hosting platforms could easily be used for spamming or DDoS attacks. For that reason, some services that run under a particularly strict DDoS protection will return `403 Forbidden` in response to any HTTP request received from those IP subnets. For example, `4chan.org`'s CloudFlare DDoS protection blocks all incoming traffic from AWS EC2. For a human, such blocking wouldn't result in an inability to use the website because they'd have an option to solve a challenge in their web browser and then continue using the website having a "bypass" cookie. But a proxy server doesn't have the means to pass such a challenge, so it'd be unable to access the API from those subnets.