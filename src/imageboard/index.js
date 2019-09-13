// Added `/index.js` so that there's no warning:
// "There are multiple modules with names that only differ in casing.
//  This can lead to unexpected behavior when compiling on a filesystem with other case-semantic."
export { default as default } from './Chan'
export { getConfig } from './chan/index'
export { default as compileWordPatterns } from './utility/compileWordPatterns'
export { default as generateQuotes } from './generateQuotes'
export { default as generatePreview } from './generatePreview'
export { default as generateThreadTitle } from './generateThreadTitle'
