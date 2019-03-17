export default function parseAuthor(name, defaultName) {
	// "Anonymous&nbsp;" -> "Anonymous".
	// (`/int/` on `2ch.hk`)
	if (name) {
		name = name.replace(/&nbsp;$/, '')
	}
	// `Аноним`
	// `Аноним&nbsp;ID:&nbsp;<span id=\"id_tag_7ab0a33a\" style=\"color:rgb(116,48,218);\">Насмешливый&nbsp;Обеликс</span>`
	// `mailto:sage`
	// `mailto:user@domain.com`
	if (name === defaultName ||
		name.indexOf('ID:&nbsp;') >= 0 ||
		name === 'mailto:sage') {
		return
	}
	// "mailto:admin@example.com" -> "admin@example.com".
	name = name.replace(/^mailto:/, '')
	if (name) {
		return name
	}
}