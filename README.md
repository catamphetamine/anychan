# <img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/assets/images/icon%40192x192.png" width="48" height="48"/> captchan

Modern GUI for imageboards (4chan.org, 8ch.net, 2ch.hk, kohlchan.net, etc).

Supported engines:

* [4chan](https://github.com/4chan/4chan-API) ([4chan.org](https://www.4chan.org/)). See [`4chan.org` demo](https://catamphetamine.github.io/captchan/?chan=4chan).
* [vichan](https://github.com/vichan-devel/vichan)/[infinity](https://github.com/ctrlcctrlv/infinity)/[OpenIB](https://github.com/OpenIB/OpenIB/) ([8ch.net](https://8ch.net/)). See [`8ch.net` demo](https://catamphetamine.github.io/captchan/?chan=8ch).
* [lynxchan](http://lynxhub.com/) ([kohlchan.net](https://kohlchan.net)). See [`kohlchan.net` demo](https://catamphetamine.github.io/captchan/?chan=kohlchan).
* [makaba](https://2ch.hk/api/) ([2ch.hk](https://2ch.hk/)). See [`2ch.hk` demo](https://catamphetamine.github.io/captchan/?chan=2ch).

Don't mind the seemingly slower speed of the demos: the only reason for that is the app can't use chan APIs directly (they don't allow it) and needs to send all HTTP requests through a free public "CORS Proxy" which introduces a delay.

This project currently has only a subset of features. "To do":

  * Add message posting.
  * Add thread watching.
  * Add thread auto-update.
  * Add "favorite" boards list.
  * Add support for "passes" (`4chan.org`, `2ch.hk`).

<!--
	Miscellaneous:

  * Add comment menu: Hide, Report, Copy Link, View Source, Hide all posts from this author (if `post.id` is available), Expand all images/videos, Run slideshow for all attachments, Open on original website.
	* Maybe add delete post/attachment button. (can delete posts and files without password on 4chan)
	* When text is selected, show "Reply" tooltip for quoting the selected text in a reply.
	* Add post selection from post menu to report several posts in a single report.
	* Format MathML equations on `4chan.org/sci`. Block-level equations: [eqn]f(x_4) = a+2*b[/eqn]. Inline equations: [math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/math].
-->

## Screenshots

#### Themes

The app comes pre-packaged with a couple of built-in themes and [allows any degree of customization](https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md) via adding custom themes. Each theme has "Regular" mode and "Dark" mode.

##### Default theme

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/default-light-3605x1929.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/default-light-1024x548.png" width="512" height="274"/>

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/default-dark-3605x1929.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/default-dark-1024x548.png" width="512" height="274"/>

##### Neon Genesis Evangelion

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/eva-light-3605x1929.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/eva-light-1024x548.png" width="512" height="274"/>

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/eva-dark-3605x1929.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/themes/eva-dark-1024x548.png" width="512" height="274"/>

#### Media

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/screenshot-slideshow-1024x555.png" width="512" height="278"/>

## Chan API

### 4chan.org

* [API (with examples)](https://github.com/catamphetamine/captchan/blob/master/docs/4chan.org.md)
* [API (official docs)](https://github.com/4chan/4chan-API)

### 8ch.net

* [API (with examples)](https://github.com/catamphetamine/captchan/blob/master/docs/8ch.net.md)

### 2ch.hk

* [API (with examples)](https://github.com/catamphetamine/captchan/blob/master/docs/2ch.hk.md)
* [API (official docs)](https://2ch.hk/api/)

### kohlchan.net

* [Old API (with examples)](https://github.com/catamphetamine/captchan/blob/master/docs/kohlchan.net.old.md) (the old `vichan` API is no longer relevant: since May 28th, 2019 `kohlchan.net` [has been migrated](https://kohlchan.net/kohl/res/13096.html) from `vichan` to `lynxchan`)

## Known issues

There're some limitations for chans running on `lynxchan` engine (for example, `kohlchan.net`) due to the [lack of support for several features](https://github.com/catamphetamine/captchan/blob/master/docs/lynxchan.md) in that engine.

The lists of threads/comments are implemented via a "[Virtual Scroller](https://github.com/catamphetamine/virtual-scroller)" which results in an enormous performance boost but at the same time [doesn't support some native in-browser features](https://github.com/catamphetamine/virtual-scroller#search-focus-management) such as "Find on page" or "Tab" key navigation or "screen readers".

## Develop

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/captchan.git
cd captchan
npm install
npm run dev
```

Go to [`http://localhost:1234`](http://localhost:1234)

## Deploy

```
cd captchan
npm run build
```

The build will be output to the `build/assets` directory.

## Proxy

All chans (`4chan.org`, `2ch.hk`, etc) don't allow calling their API from other websites by prohibiting [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for another website to be able to query chan API directly.

A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) can be used for development/testing. Such public CORS proxy imposes several restrictions such as no support for "cookies" and also introduces an artifical delay (a couple of seconds) for all API requests. There's also some [list of public CORS proxies](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347).

For production deployment a dedicated CORS proxy should be used. A free AWS EC2 "micro" server could be set up but CloudFlare blocks traffic from AWS EC2 (I guess because it can be easily set up for a DDoS attack) so `4chan.org`, for example, won't work and will return `403 Forbidden` for an AWS EC2 proxy.

<details>
<summary>An example of setting up a free AWS EC2 CORS proxy</summary>

####

AWS offers a year-long "free tier" usage plan for EC2 "micro" server instances.

<!-- https://trodzen.wordpress.com/2018/04/07/yet-another-linux-ec2-server-config/ -->

* Create a free EC2 "micro" instance.
* Connect to it via SSH as `ec2-user`.
* Install nginx: `sudo amazon-linux-extras install nginx1.12`
* Auto start nginx: `sudo chkconfig nginx on`
* Configure nginx: `sudo nano /etc/nginx/nginx.conf`

```nginx
http {
	# This is required to resolve DNS names when proxying.
	resolver 172.31.0.2;

	# ... some standard configuration ...

	server {
		listen 80;
		server_name _; # applies for any domain name.

		# This setting is required to keep double slashes in the requested URL.
		merge_slashes off;

		# Only proxy URLs starting with "http://" or "https://".
		location ~* ^/https?://.+$ {
			# Serve `OPTIONS` "preflight" requests.
			if ($request_method = 'OPTIONS') {
				# Allow all websites access to this CORS proxy.
				# Could be restricted via an nginx variable.
				add_header Access-Control-Allow-Origin $http_origin;
				# Allow sending cookies as part of an HTTP request (optional).
				add_header Access-Control-Allow-Credentials true;
				# Allow all HTTP request headers.
				add_header Access-Control-Allow-Headers $http_access_control_request_headers;
				# Allow all HTTP request methods.
				add_header Access-Control-Allow-Methods $http_access_control_request_method;

				add_header Content-Type 'text/plain charset=UTF-8';
				add_header Content-Length 0;
				return 204;
			}

			# Allow all websites access to this CORS proxy.
			# " always" in the end is required for also setting
			# the CORS headers on "404 Not Found" responses.
			# Could be restricted via an nginx variable.
			add_header Access-Control-Allow-Origin $http_origin always;
			# Allow sending cookies as part of an HTTP request (optional).
			add_header Access-Control-Allow-Credentials true always;
			# Allow all HTTP request headers.
			add_header Access-Control-Allow-Headers $http_access_control_request_headers always;
			# Allow all HTTP request methods.
			add_header Access-Control-Allow-Methods $http_access_control_request_method always;

			# Trim the leading slash from `$request_uri` (URL path).
			rewrite ^/(.+)$ $1 break;

			# Generic proxying headers which are added to the proxied HTTP request.
			# This is just some info for the destination server that it may potentially use.
			# They are not required.
			#
			# Set the proxied HTTP request "HOST" header to this server's "HOST" (host and port).
			proxy_set_header HOST $host;
			# Which protocol did the client request.
			proxy_set_header X-Forwarded-Proto $scheme;
			# Pass client's IP address.
			proxy_set_header X-Real-IP $remote_addr;
			# The list of proxies used to proxy this HTTP request.
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			# Pass "If-Modified-Since" header to the server.
			proxy_set_header If-Modified-Since $http_if_modified_since;

			# (optional) Use HTTP/1.1 instead of the default HTTP/1.0.
			# For example, HTTP/1.1 has support for "entity tags" caching.
			proxy_http_version 1.1;

			# Proxy the HTTP request to the destination server.
			proxy_pass $1;
		}
	}
}
```

* Reload `nginx` config: `sudo service nginx reload`
* `nginx` should be working (HTTP should output a dummy webpage).
* Next, an SSL certificate will be generated. "letsEncrypt" rejects AWS domains, so set up a free domain somehwere on `dot.tk` which will have a DNS `A` record pointing to the AWS server IP address.

* Install `certbot` for issuing free "letsEncrypt" certificates:

```sh
# download, install, and Enable EPEL
wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
sudo yum-config-manager --enable epel*
sudo yum repolist all

# install certbot
sudo yum install certbot
```

* Create config for `certbot`: `sudo mkdir -p /etc/letsencrypt && sudo nano /etc/letsencrypt/cli.ini`

```
authenticator = webroot
webroot-path = /var/www/html
post-hook = systemctl reload nginx
text = True
```

* Create a dummy "ACME challenge" response file: `sudo mkdir -p /var/www/html/.well-known/acme-challenge && sudo sh -c "echo Success > /var/www/html/.well-known/acme-challenge/example.html"`

* Register in letsEncrypt network: `sudo certbot register --email me@example.com`

* Configure `nginx` to serve "ACME challenge" response files:

```nginx
server {
  ...
  location /.well-known {
    root /var/www/html;
  }
  ...
}
```

* Check the dummy "ACME challenge" response: `sudo service nginx reload && curl -L http://YOUR-DOMAIN-NAME-HERE/.well-known/acme-challenge/example.html`

* If it says "Success" then remove the dummy "ACME challenge" response file (`certbot` will create its own): `sudo rm /var/www/html/.well-known/acme-challenge/example.html`

* Check `certbot` certificate issueance: `sudo certbot certonly --dry-run -d YOUR_DOMAIN_NAME_HERE`

* If it says "The dry run was successful" then issue the certificate: `sudo certbot certonly -d YOUR_DOMAIN_NAME_HERE`

* Set up `nginx` to use the generated certificates in the `server` entry:

```nginx
server {
	listen 80;
	listen 443 ssl;
	...

	ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_NAME_HERE/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_NAME_HERE/privkey.pem;
	ssl_trusted_certificate /etc/letsencrypt/live/YOUR_DOMAIN_NAME_HERE/chain.pem;

	# Optimize certificate chain loading in a single round trip.
	ssl_stapling on;
	ssl_stapling_verify on;
	...
}
```

<!--
```
# domains to retrieve certificate.
# AWS domains are rejected by letsEncrypt.
# One can use something like `dot.tk` for a temporary free domain.
domains = www.example.tk # change to the cors proxy host name

# increase key size
rsa-key-size = 4096

# the CA endpoint server
server = https://acme-v01.api.letsencrypt.org/directory

# the email to receive renewal reminders, IIRC
email = letsencrypt@example.com # change to your email address

# turn off the ncurses UI, we want this to be run as a cronjob
text = True
```
-->

* letsEncrypt certificates expire in 90 days, so schedule a daily renewal job:

`sudo nano /etc/crontab`:

```
# The job is run daily because certificates don't get
# renewed unless they are near to expiration.
0 8 * * * root certbot renew --quiet --allow-subset-of-names
```

* Reload `nginx` config: `sudo service nginx reload`

* HTTPS should be working.

I've had an issue with `certbot` generating an empty `*.conf` file for the website for some reason which prevented it from renewing the certificate but the fix was [easy](https://github.com/certbot/certbot/issues/7093).

</details>

####

In `./configuration/default.json` there's `corsProxyUrl` setting — this is the CORS-proxy that will be used for querying chan API.

## Configuration

By default the application uses `./configuration/default.json` settings.

To define custom/additional settings one can create `configuration.json` file in the `./configuration` directory.

<details>
<summary>Example:</summary>

#### configuration.json

```js
{
	// The default chan to use.
	// Can be overridden via a `?chan=` URL parameter.
	"chan": "4chan",
	// Google Analytics can be used for tracking page views.
	// Though most users block it in their web browsers.
	"googleAnalytics": {
		"id": "UA-123456789-0"
	},
	// YouTube Data API V3 is used for parsing YouTube links
	// into embedded video attachments having a title and a thumbnail.
	"youtube": {
		"apiKey": "TpJTfNAIzaFVteEnl4E-SyCvZRvuuHUZeL3owO8"
	},
	// CORS Proxy settings (see the "Proxy" section of the readme).
	// AWS EC2 is the easiest way to set up a free 1-year proxy.
	"corsProxyUrlAws": "https://example.compute.amazonaws.com/{url}",
	// Chans behind CloudFlare CDN deny access for AWS IP addresses.
	// Such chans can be proxied through Heroku, for example.
	"corsProxyUrl": "https://example.herokuapp.com/{url}",
	// `sentry.io` can be set up to report all client-side errors.
	"sentry.io": {
		"url": "https://1d8af64f618e9b01849237ccbc26e968@sentry.io/1413881"
	},
	// Sometimes chan administration needs to announce something
	// to the users. Things like latest news, contests, etc.
	// See the "Announcements" section below.
	"announcementUrl": "/announcement.json",
	// Announcement polling interval (in milliseconds).
	// By default it checks for new announcements every hour:
	// 60 * 60 * 1000 = 3600000
	"announcementPollInterval": 3600000
}
```

<details>
<summary>Announcements</summary>

###

Sometimes chan administration needs to announce something to the users. Things like latest news, contests, etc. For that an optional `announcementUrl` configuration parameter exists. For example, if a chan is hosted at `4chan.org` then `announcementUrl` could be `/announcement.json` meaning that the app will periodically try to `GET https://4chan.org/announcement.json` and show the announcement if it exists: a user will be presented with an announcement bar on top of the page. When a user clicks the close (x) button a `announcementRead` cookie is created with the value of the announcement date and so the announcement is no longer shown for this user until there's a new announcement with a different date.

#### announcement.json

```js
{
	// Date in "ISO" format.
	// Could be just a date:
	// date: "2019-07-02"
	// or a date with time:
	date: "2019-07-02T14:37",
	// Announcement content (either a string or an array of strings and objects).
	content: [
		"4chan is now owned and led by ",
		{
			"type": "link",
			"url": "https://twitter.com/hiroyuki_ni",
			"content": "Hiroyuki Nishimura"
		},
		", the founder of the largest anonymous BBS in Japan, 2channel. Read the full announcement on the ",
		{

			"type": "link",
			"url": "https://www.4chan.org/4channews.php",
			"content": "4chan News page"
		},
		"."
	]
}
```
</details>