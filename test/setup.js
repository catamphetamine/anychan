import chai, { expect } from 'chai'
import fetch from 'node-fetch'

import DEFAULT_CONFIGURATION from '../configuration/default.json'

// global._TEST_ = true

global.CONFIG = {
	...DEFAULT_CONFIGURATION,
	version: '0.1.0'
}

chai.should()
global.expect = expect

global.expectToEqual = (a, b) => expect(a).to.deep.equal(b)

// `social-components/services/YouTube/getVideo.js` uses `fetch()`.
global.fetch = fetch