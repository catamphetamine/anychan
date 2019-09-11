import Engine from '../../engine/lynxchan'
import config from './index.json'
export default (options) => new Engine(config, options)