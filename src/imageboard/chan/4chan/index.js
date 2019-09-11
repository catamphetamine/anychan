import Engine from '../../engine/4chan'
import config from './index.json'
export default (options) => new Engine(config, options)