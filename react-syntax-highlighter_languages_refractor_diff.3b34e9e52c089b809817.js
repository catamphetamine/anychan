(self.webpackChunkcaptchan=self.webpackChunkcaptchan||[]).push([[6247],{93336:e=>{"use strict";function a(e){!function(e){e.languages.diff={coord:[/^(?:\*{3}|-{3}|\+{3}).*$/m,/^@@.*@@$/m,/^\d+.*$/m]};var a={"deleted-sign":"-","deleted-arrow":"<","inserted-sign":"+","inserted-arrow":">",unchanged:" ",diff:"!"};Object.keys(a).forEach((function(n){var s=a[n],i=[];/^\w+$/.test(n)||i.push(/\w+/.exec(n)[0]),"diff"===n&&i.push("bold"),e.languages.diff[n]={pattern:RegExp("^(?:["+s+"].*(?:\r\n?|\n|(?![\\s\\S])))+","m"),alias:i,inside:{line:{pattern:/(.)(?=[\s\S]).*(?:\r\n?|\n)?/,lookbehind:!0},prefix:{pattern:/[\s\S]/,alias:/\w+/.exec(n)[0]}}}})),Object.defineProperty(e.languages.diff,"PREFIXES",{value:a})}(e)}e.exports=a,a.displayName="diff",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_diff.3b34e9e52c089b809817.js.map