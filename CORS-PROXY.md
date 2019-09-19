# An example of setting up a free AWS EC2 CORS proxy

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
			# "$is_args$args" is for GET URL parameters
			# otherwise they'd be discarded.
			proxy_pass $1$is_args$args;
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