import Parser from '../../parser/4chan/Parser'
import chan from './index.json'
export default (options) => new Parser(chan, options)