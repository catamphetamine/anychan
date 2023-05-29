Summary
=======

This folder contains a "build" of `anychan` — a universal discussion platform client.

https://anychans.github.io
https://github.com/catamphetamine/anychan
https://gitlab.com/catamphetamine/anychan

Hosting
=======

This "build" should be hosted as a "static" website somewhere on a server or in a cloud.

Configuration
=============

Open `index.html` file and see the `<script>` section at the top of it:

```
<script>
	// Set your config parameters here.
	// https://gitlab.com/catamphetamine/anychan#configuration
	var CONFIG = {}
</script>
```

Insert your custom configuration inside the curly braces. See the docs for more details on the available configuration options: https://github.com/catamphetamine/anychan#configuration

Some of the available configuration options are:

```
{
  // By default, the application assumes that it's hosted at the root of the domain.
  // If it's not the case, i.e. if it's hosted at a "subpath", then specify that "subpath" here.
  // For example, if the application is hosted at "https://domain.com/application"
  // then the "path" configuration parameter should be set to "/application".
  "path": "/anychan",

  // The `dataSource` parameter describes the data source being used.
  //
  // If the data source is a "supported-out-of-the-box" one,
  // then the "dataSource" parameter can be set to such data source name:
  //
  // * "4chan"
  // * "8ch"
  // * "2ch"
  // * "kohlchan"
  // * "lainchan"
  //
  // Specifying the "dataSource" parameter in such cases can be omitted
  // if this application runs on the data source's main domain (e.g. "4chan.org")
  // because the application is smart enough to detect that type of situation
  // and will automatically determine the correct data source name.
  // In other cases — when running the application on other domains —
  // specifying a data source is required, unless you'd prefer the application
  // to run in a "multi-datasource" mode in which case it will require
  // a data source name as a URL path prefix. For example, "https://domain.com/4chan/b".
  //
  // When a data source is not a "supported-out-of-the-box" one,
  // the "dataSource" configuration parameter value should be an object
  // describing the configuration parameters of the data source:
  //
  // * `logo`
  // * `title`
  // * `api`
  // * etc
  //
  // See "Adding a new imageboard" section of the docs for more info on
  // the available configuration parameters for a custom data source.
  //
  "dataSource": "4chan",

  // CORS proxy URL (see the "Proxy" section of the docs).
  //
  // A CORS proxy is required unless this application is running on the
  // data source's main domain (e.g. "4chan.org").
  // That's a stupid limitation of all web browsers.
  //
  // A CORS proxy URL string should contain a target URL parameter.
  // The target URL parameter could be present in that string in one of the two variants:
  // * `{url}` — the target URL.
  // * `{urlEncoded}` — the target URL encoded using `encodeURIComponent()`.
  //
  // Examples:
  // * "https://my-cors-proxy.com/{url}"
  // * "https://my-cors-proxy.com?url={urlEncoded}"
  //
  "proxyUrl": "https://anychan-proxy.vercel.app?url={urlEncoded}"
}
```