(self.webpackChunkcaptchan=self.webpackChunkcaptchan||[]).push([[2584,3047,369],{84790:(e,n,t)=>{"use strict";var a=t(56939),r=t(93205);function s(e){e.register(a),e.register(r),function(e){e.languages.erb=e.languages.extend("ruby",{}),e.languages.insertBefore("erb","comment",{delimiter:{pattern:/^<%=?|%>$/,alias:"punctuation"}}),e.hooks.add("before-tokenize",(function(n){e.languages["markup-templating"].buildPlaceholders(n,"erb",/<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s[\s\S]*?^=end)+?%>/gm)})),e.hooks.add("after-tokenize",(function(n){e.languages["markup-templating"].tokenizePlaceholders(n,"erb")}))}(e)}e.exports=s,s.displayName="erb",s.aliases=[]},93205:e=>{"use strict";function n(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,r,s){if(t.language===a){var i=t.tokenStack=[];t.code=t.code.replace(r,(function(e){if("function"==typeof s&&!s(e))return e;for(var r,o=i.length;-1!==t.code.indexOf(r=n(a,o));)++o;return i[o]=e,r})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var r=0,s=Object.keys(t.tokenStack);!function i(o){for(var u=0;u<o.length&&!(r>=s.length);u++){var l=o[u];if("string"==typeof l||l.content&&"string"==typeof l.content){var g=s[r],c=t.tokenStack[g],d="string"==typeof l?l:l.content,p=n(a,g),b=d.indexOf(p);if(b>-1){++r;var f=d.substring(0,b),m=new e.Token(a,e.tokenize(c,t.grammar),"language-"+a,c),h=d.substring(b+p.length),k=[];f&&k.push.apply(k,i([f])),k.push(m),h&&k.push.apply(k,i([h])),"string"==typeof l?o.splice.apply(o,[u,1].concat(k)):l.content=k}}else l.content&&i(l.content)}return o}(t.tokens)}}}})}(e)}e.exports=n,n.displayName="markupTemplating",n.aliases=[]},56939:e=>{"use strict";function n(e){!function(e){e.languages.ruby=e.languages.extend("clike",{comment:[/#.*/,{pattern:/^=begin\s[\s\S]*?^=end/m,greedy:!0}],"class-name":{pattern:/(\b(?:class)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/});var n={pattern:/#\{[^}]+\}/,inside:{delimiter:{pattern:/^#\{|\}$/,alias:"tag"},rest:e.languages.ruby}};delete e.languages.ruby.function,e.languages.insertBefore("ruby","keyword",{regex:[{pattern:RegExp(/%r/.source+"(?:"+[/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/.source,/\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/.source,/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/.source,/\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/.source,/<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/.source].join("|")+")"),greedy:!0,inside:{interpolation:n}},{pattern:/(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[gim]{0,3}(?=\s*(?:$|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}],variable:/[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,symbol:{pattern:/(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/,lookbehind:!0},"method-definition":{pattern:/(\bdef\s+)[\w.]+/,lookbehind:!0,inside:{function:/\w+$/,rest:e.languages.ruby}}}),e.languages.insertBefore("ruby","number",{builtin:/\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,constant:/\b[A-Z]\w*(?:[?!]|\b)/}),e.languages.ruby.string=[{pattern:RegExp(/%[qQiIwWxs]?/.source+"(?:"+[/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,/\((?:[^()\\]|\\[\s\S])*\)/.source,/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/.source,/\[(?:[^\[\]\\]|\\[\s\S])*\]/.source,/<(?:[^<>\\]|\\[\s\S])*>/.source].join("|")+")"),greedy:!0,inside:{interpolation:n}},{pattern:/("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0,inside:{interpolation:n}}],e.languages.rb=e.languages.ruby}(e)}e.exports=n,n.displayName="ruby",n.aliases=["rb"]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_erb.c7be73c88f884adc9352.js.map