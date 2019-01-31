export default function unescapeContent(string) {
	return string
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		// .replace(/&#39;/g, '\'')
		// .replace(/&#47;/g, '/')
		// .replace(/&#92;/g, '\\')
		.replace(/&#([0-9]{1,3});/gi, (match, code) => String.fromCharCode(parseInt(code, 10)))
}