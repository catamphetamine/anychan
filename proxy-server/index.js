import path from 'path'
import webservice from 'web-service'

import configuration from '../configuration'
import startProxyServer from 'webapp-frontend/proxy-server/main'

// Proxy `/api` requests to API server.
// Wouldn't do it in a real-world app
// and would just query the API directly
// but Chrome won't allow that for `localhost`.
startProxyServer(configuration)