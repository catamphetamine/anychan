(window.webpackJsonp=window.webpackJsonp||[]).push([[121],{1786:function(e,t,n){"use strict";function a(e){e.languages.rust={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:[{pattern:/b?r(#*)"(?:\\.|(?!"\1)[^\\\r\n])*"\1/,greedy:!0},{pattern:/b?"(?:\\.|[^\\\r\n"])*"/,greedy:!0}],char:{pattern:/b?'(?:\\(?:x[0-7][\da-fA-F]|u{(?:[\da-fA-F]_*){1,6}|.)|[^\\\r\n\t'])'/,alias:"string"},"lifetime-annotation":{pattern:/'[^\s>']+/,alias:"symbol"},keyword:/\b(?:abstract|alignof|as|be|box|break|const|continue|crate|do|dyn|else|enum|extern|false|final|fn|for|if|impl|in|let|loop|match|mod|move|mut|offsetof|once|override|priv|pub|pure|ref|return|sizeof|static|self|Self|struct|super|true|trait|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,attribute:{pattern:/#!?\[.+?\]/,greedy:!0,alias:"attr-name"},function:[/\w+(?=\s*\()/,/\w+!(?=\s*\(|\[)/],"macro-rules":{pattern:/\w+!/,alias:"function"},number:/\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,"closure-params":{pattern:/\|[^|]*\|(?=\s*[{-])/,inside:{punctuation:/[|:,]/,operator:/[&*]/}},punctuation:/[{}[\];(),:]|\.+|->/,operator:/[-+*\/%!^]=?|=[=>]?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/}}e.exports=a,a.displayName="rust",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_rust.752b6211de5a8cff15f4.js.map