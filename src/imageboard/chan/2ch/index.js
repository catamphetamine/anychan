import Engine from '../../engine/makaba'
import config from './index.json'
export default (options) => new Engine(config, options)