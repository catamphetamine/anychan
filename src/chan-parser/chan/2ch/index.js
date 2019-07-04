import Parser from '../../parser/2ch/Parser'
import chan from './index.json'
export default (options) => new Parser(chan, options)