import settings, { icon } from '../src/react-website'
import configuration from '../configuration'

import startRenderingService from 'webapp-frontend/rendering-service/start'

export default function(parameters) {
  startRenderingService(settings, configuration, parameters, icon)
}
