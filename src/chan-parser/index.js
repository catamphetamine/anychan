// Added `/index.js` so that there's no warning:
// "There are multiple modules with names that only differ in casing.
//  This can lead to unexpected behavior when compiling on a filesystem with other case-semantic."
export { default as default } from './parser/index.js'
export { default as getChan } from './chan/index.js'
export { default as compileWordPatterns } from './utility/compileWordPatterns'