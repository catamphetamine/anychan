import { should, expect } from 'chai'
import fetch from 'node-fetch'

import DEFAULT_CONFIGURATION from '../configuration/default.json' assert { type: 'json' }

// Adds `.should` to `Object.prototype`.
should()

// global._TEST_ = true

global.CONFIG = {
	...DEFAULT_CONFIGURATION,
	version: '0.1.0'
}

global.expect = expect

global.expectToEqual = (a, b) => expect(a).to.deep.equal(b)

// `social-components/services/YouTube/getVideo.js` uses `fetch()`.
global.fetch = fetch