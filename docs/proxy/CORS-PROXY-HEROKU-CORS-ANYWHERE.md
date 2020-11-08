# An example of setting up a free EC2 CORS proxy on Heroku running "CORS Anywhere"

[Documentation](https://devcenter.heroku.com/articles/deploying-nodejs)

* [Create an account](https://www.heroku.com/nodejs) on Heroku.
* Install their [command-line utility](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true).
* `heroku login`.
* Create a new folder somewhere: `cd /path/to/your/projects && mkdir cors-proxy`.
* Navigate to the folder: `cd cors-proxy`.
* Initialize a Git repo: `git init`.
* Create `.gitignore` file:

```
/node_modules
npm-debug.log
.DS_Store
/*.env
```

* Create a `package.json` file: `npm init`.
<!-- * Optionally specify Node.js version in `package.json`: `"engines": { "node": "10.x" },`. -->
* Add `"start": "node index.js",` to `"scripts"` in `package.json`.
* Install "CORS Anywhere": `npm install cors-anywhere --save`.
* Create `index.js` file:

```js
// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '0.0.0.0'
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080

const cors_proxy = require('cors-anywhere')
cors_proxy.createServer({
  originWhitelist: [] // Allows all "origins".
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port)
})
```

* Set up `originWhitelist` in `index.js` to only include the "origin" (`https://` plus the domain) on which the web application is hosted (in my case it's `https://captchan.surge.sh`). For development, set up a dedicated CORS proxy, or use a public one like `https://cors-anywhere.herokuapp.com`: a production deployment should have only a single origin whitelisted for [security reasons](https://github.com/Rob--W/cors-anywhere/issues/55).

* Also, in `lib/cors-anywhere.js`, comment out the cookie removal lines:

```js
// Strip cookies
delete proxyRes.headers['set-cookie'];
delete proxyRes.headers['set-cookie2'];
```

Those cookie removal lines were added for security: to prevent cookies set by one proxied website be visible to some other proxied website, but since the proxy is being set up to only serve a single website, these security measures aren't required, and removing them won't introduce a security breach.

* Initialize Heroku application:

```
heroku create <globally-unique-application-name>
```

* Push the changes to Heroku:

```
git add .
git commit -m "Initial commit"
git push heroku master
```

In future, to apply any changes to the CORS proxy, re-push the changes to Heroku.

## Known issues

CORS Anywhere has an issue: it [doesn't support](https://github.com/Rob--W/cors-anywhere/issues/55) `cookies` which are required for `4chan.org` "passes" or `2ch.hk` "passcodes".

To work around that:

* Go to [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) repository.
* Click "Clone or download" -> "Download ZIP".
* Unpack the archive and copy the `lib` folder to the cors proxy folder.
* Replace `require('cors-anywhere')` with `require('./lib/cors-anywhere')`.
* Copy `"dependencies"` from `package.json` of the unpacked archive to `package.json` in the cors proxy folder.
* `npm install`.
* Go to `./lib/cors-anywhere.js` and replace `headers['access-control-allow-origin'] = '*'` with `headers['access-control-allow-origin'] = 'INSERT_THE_ORIGIN_OF_YOUR_APP_HERE'` and add `headers['access-control-allow-credentials'] = true;` after it. Save the file.
* Check that it still works: `npm start`.
* `git add .`.
* `git commit -m "Fixed cookies"`.
* `git push heroku master`.

<!--
## Analytics

To show the list of the latest proxied URLs on `/log` path, modify `./lib/cors-anywhere.js`:

```js
...
// Request handler factory
function getHandler(options, proxy) {
  var latestRequests = []
  var MAX_LATEST_REQUESTS = 5000
  ...
  return function(req, res) {
    if (req.url === '/log') {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
      res.end(randomizeIps(latestRequests).map(({ time, ip, location }) => {
        return `${formatDate(new Date(time))} · ${ip} · ${location.host}${location.path}`
      }).join('\n'))
      return
    }
    ...
    if (latestRequests.length === MAX_LATEST_REQUESTS) {
      latestRequests.shift()
    }
    latestRequests.push({
      // IP addresses could be hashed, but that wouldn't actually hide them,
      // because a potential attacker could hash all possible IPs
      // with the same hashing algorithm and then simply compare to identify them.
      // Therefore, IP addresses are simply randomized on each render.
      ip: req.connection.remoteAddress,
      time: Date.now(),
      location
    })
    var isRequestedOverHttps = ...
    ...
 	}
}

...

// http://jsfiddle.net/a_incarnati/kqo10jLb/4/
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return getTwoCharacterNumber(date.getDate()) + '.' +
    getTwoCharacterNumber(date.getMonth() + 1) + '.' +
    date.getFullYear() + ' ' +
    getTwoCharacterNumber(hours) + ':' +
    getTwoCharacterNumber(minutes);
}

function getTwoCharacterNumber(number) {
  if (number < 10) {
    return '0' + number
  }
  return number
}

function randomizeIps(requests) {
  var IPS = {}
  return requests.map((request) => ({
    ...request,
    ip: IPS[request.ip] || (IPS[request.ip] = getNewCharacter(IPS))
  }))
}

// https://www.w3schools.com/charsets/ref_html_utf8.asp
var MIN_CHAR_CODE = 8352
function getNewCharacter(characters) {
  return String.fromCharCode(MIN_CHAR_CODE + Object.keys(characters).length)
}
```
-->