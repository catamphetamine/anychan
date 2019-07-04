import Parser from '../../parser/lynxchan/Parser'
import chan from './index.json'
export default (options) => new Parser(chan, options)