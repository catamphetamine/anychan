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
  originWhitelist: [] // Allow all origins.
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port)
})
```

* `heroku create <globally-unique-application-name>`.
* `git add .`.
* `git commit -m "Initial commit"`.
* `git push heroku master`.

To make any changes to the CORS proxy, edit the files and run `git push heroku master` again.

## Known issues

CORS Anywhere has an issue: it [doesn't support](https://github.com/Rob--W/cors-anywhere/issues/55) `cookies` which are required for `4chan.org` "passes" or `2ch.hk` "passcodes".

To work around that:

* Go to [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) repository.
* Click "Clone or download" -> "Download ZIP".
* Unpack the archive and copy the `lib` folder to the cors proxy folder.
* Replace `require('cors-anywhere')` with `require('./lib/cors-anywhere')`.
* Copy `"dependencies"` from `package.json` of the unpacked archive to `package.json` in the cors proxy folder.
* `npm install`.
* Go to `./lib/cors-anywhere.js` and replace `headers['access-control-allow-origin'] = '*'` with `headers['access-control-allow-origin'] = request.headers['origin']` and add `headers['access-control-allow-credentials'] = true;` after it. Save the file.
* Check that it still works: `npm start`.
* `git add .`.
* `git commit -m "Fixed cookies"`.
* `git push heroku master`.