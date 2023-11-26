# An example of setting up a free AWS EC2 CORS proxy

## AWS EC2 Instance

AWS offers a [year-long](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=tier%2312monthsfree&awsf.Free%20Tier%20Categories=categories%23compute) "free tier" usage plan for EC2 "micro" server instances.

<!-- https://trodzen.wordpress.com/2018/04/07/yet-another-linux-ec2-server-config/ -->

* Create a free EC2 "micro" instance.
* While creating an EC2 instance, on "Step 6. Configure Security Groups" add the `80` (for HTTP) and `443` (for HTTPS) ports for `nginx` using "Add Rule" button. Alternatively, after creating an EC2 instance: Select the instance -> Scroll right -> Click the security group -> "Actions" -> "Edit inbound rules" -> "Add Rule".
* Create a new SSH key for accessing the server. Download the `*.pem` file. Convert the `*.pem` file to a `*.ppk` file using [PuTTYGen](https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/putty.html): "Load" the `*.pem` file, optionally specify a "Key passphrase", click "Save Private Key".
* Connect to the server via SSH using the `*.ppk` key and `ec2-user` username.

## CORS proxy

* Install Node.js
* Clone [`anychan-proxy`](https://gitlab.com/catamphetamine/anychan-proxy) repository.
* Go to the `anychan-proxy` folder.
* Edit `config.json` as appropriate.
* Run `npm start` command in `anychan-proxy` folder. That will start the CORS proxy server.

* Set up `anychan-proxy` to be run automatically on system startup in case the server instance decides to reboot.

<!--
NginX is no longer used as a proxy because "cors-anywhere" code
has been patched to support custom features like `X-Cookie` or `X-Set-Cookie`,
and that patched version of "cors-anywhere" should be used instead.

* Install nginx: `sudo amazon-linux-extras install nginx1.12`
* Auto start nginx: `sudo chkconfig nginx on`
* Configure nginx: `sudo nano /etc/nginx/nginx.conf`

```nginx
http {
	# This is required to resolve DNS names when proxying.
	# AWS Route 53 service address is 172.31.0.2
	resolver 172.31.0.2;

	# ... Somewhere here resides the generic NginX configuration. Ignore it and scroll down. ...

	server {
		# The HTTP server will be listening on port 80.
		listen 80;

		# This configuration line tells the HTTP server to respond to any domain name
		# as long as that domain name led to this particular AWS instance.
		server_name _;

		# This setting is required to keep double slashes in the requested URL.
		merge_slashes off;

		# Remove `root`, `location /` and `error_page` entries.

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
-->

<!--
This seems to be no longer relevant:
map $http_origin $allow_origin {
	default "https://catamphetamine.github.io";
	https://some.other.domain "https://some.other.domain";
}
add_header Access-Control-Allow-Origin $allow_origin always;
-->

<!--
* Set up `Access-Control-Allow-Origin` in `/etc/nginx/nginx.conf` to only be the "origin" (`https://` plus the domain) on which the web application is hosted (in my case it's `https://anychans.github.io`) by replacing `add_header Access-Control-Allow-Origin $http_origin` with `add_header Access-Control-Allow-Origin 'INSERT_THE_ORIGIN_OF_YOUR_APP_HERE'`. For development, set up a dedicated CORS proxy, or use a public one like `https://cors-anywhere.herokuapp.com`: a production deployment should have only a single origin whitelisted for [security reasons](https://github.com/Rob--W/cors-anywhere/issues/55).

* Restart `nginx`: `sudo service nginx restart`. Could reload `nginx` instead: `sudo service nginx reload`, but it says "Job for nginx.service invalid." until restarted for the first time.
* `nginx` should be working: opening the server's HTTP URL in a web browser should output a dummy webpage. Otherwise see `sudo tail /var/log/nginx/error.log`.
-->

## SSL Certificate

* Next, an SSL certificate has to be generated. "letsEncrypt" rejects AWS domains, so set up a free domain somewhere that will have a DNS `A` record pointing to the AWS server IP address. For example, to create a 1-year free `*.tk` domain name, go to `dot.tk` website, sign up, in the top menu choose "Services" -> "Register a New Domain", enter some domain name (for example, "anychan"), see if it's available, click "Get It Now", click "Checkout", click "Use DNS", in the "IP Address" fields enter the AWS EC2 instance IPv4 address, click "Continue", click "Complete Order". The resulting "non-AWS" domain name will be `DOT-TK-DOMAIN-NAME.tk`.

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

* Register in letsEncrypt network: `sudo certbot register --email YOUR-EMAIL-ADDRESS-HERE`

* Install nginx: `sudo amazon-linux-extras install nginx1.12`
* Auto start nginx: `sudo chkconfig nginx on`
* Configure nginx: `sudo nano /etc/nginx/nginx.conf`

```nginx
http {
	# This is required to resolve DNS names when proxying.
	# AWS Route 53 service address is 172.31.0.2
	resolver 172.31.0.2;

	# ... Somewhere here resides the generic NginX configuration. Ignore it and scroll down. ...

	server {
		# The HTTP server will be listening on port 80.
		listen 80;

		# This configuration line tells the HTTP server to respond to any domain name
		# as long as that domain name led to this particular AWS instance.
		server_name _;

		# This setting is required to keep double slashes in the requested URL.
		merge_slashes off;

		# Remove `root`, `location /` and `error_page` entries.

		# Only proxy URLs starting with "http://" or "https://".
		location ~* ^/https?://.+$ {
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

* Configure `nginx` to serve the dummy "ACME challenge" response files by adding a new `location` entry inside the `server` block in `/etc/nginx/nginx.conf` file:

```nginx
server {
  ...
  location /.well-known {
    root /var/www/html;
  }
  ...
}
```

* Reload NginX configuration: `sudo service nginx reload`

* Check the dummy "ACME challenge" response for AWS domain name: `curl -L http://YOUR-INSTANCE-SUBNAME.YOUR-REGION.compute.amazonaws.com
/.well-known/acme-challenge/example.html`

* If it says "Success" then the "ACME challenge" has been set up correctly. Now check the non-AWS domain name you've created on `dot.tk` or some other free DNS service — check the dummy "ACME challenge" response for non-AWS domain name: `curl -L http://YOUR-NON-AWS-DOMAIN-NAME-HERE/.well-known/acme-challenge/example.html`

* If it says "Success" then remove the dummy "ACME challenge" response file (`certbot` will create its own): `sudo rm /var/www/html/.well-known/acme-challenge/example.html`

* Check `certbot` certificate issueance: `sudo certbot certonly --dry-run -d YOUR_NON_AWS_DOMAIN_NAME_HERE`

* If it says "The dry run was successful" then issue the certificate: `sudo certbot certonly -d YOUR_NON_AWS_DOMAIN_NAME_HERE`

* Set up `nginx` to use the generated certificates in the `server` entry of `/etc/nginx/nginx.conf` file:

```nginx
server {
	listen 80;
	listen 443 ssl;
	...

	ssl_certificate /etc/letsencrypt/live/YOUR_NON_AWS_DOMAIN_NAME_HERE/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/YOUR_NON_AWS_DOMAIN_NAME_HERE/privkey.pem;
	ssl_trusted_certificate /etc/letsencrypt/live/YOUR_NON_AWS_DOMAIN_NAME_HERE/chain.pem;

	# Optimize certificate chain loading in a single round trip.
	ssl_stapling on;
	ssl_stapling_verify on;
	...
}
```

* Reload NginX configuration: `sudo service nginx reload`

<!--
```
# domains to retrieve certificate.
# AWS domains are rejected by letsEncrypt.
# One can use something like `dot.tk` for a temporary free domain.
domains = example.tk # change to the cors proxy host name

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

* HTTPS should be working. Test it by opening `https://YOUR-NON-AWS-DOMAIN-NAME` in a web browser. If it doesn't output the dummy page, see `sudo tail /var/log/nginx/error.log`.

P.S. I've had an issue with `certbot` generating an empty `*.conf` file for the website for some reason which prevented it from renewing the certificate but the fix [wasn't difficult](https://community.letsencrypt.org/t/certstorageerror-renewal-config-file-is-missing-a-required-file-reference/94243): I just deleted the old files and then re-created the certificate and it also created a proper non-empty `.conf` file.

```
sudo rm -rf /etc/letsencrypt/archive/www.chan-chan.tk
sudo rm -rf /etc/letsencrypt/live/www.chan-chan.tk
sudo rm /etc/letsencrypt/renewal/www.chan-chan.tk.conf

sudo certbot certonly -d www.chan-chan.tk
```