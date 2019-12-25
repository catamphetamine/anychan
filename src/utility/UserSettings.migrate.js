export default function migrate(settings, version = 0) {
	// Version 1.
	// Dec 24, 2019.
	// Renamed `fontSize`s: "small", "medium", "large" -> "xs", "s", "m", "l", "xl".
	if (version < 1) {
		if (settings.fontSize) {
			settings.fontSize = migrateFontSize(settings.fontSize)
		}
	}
}

// Version 1.
// Dec 24, 2019.
// Renamed `fontSize`s: "small", "medium", "large" -> "xs", "s", "m", "l", "xl".
function migrateFontSize(fontSize) {
	switch (fontSize) {
		case 'small':
			return 's'
		case 'medium':
			return 'm'
		case 'large':
			return 'l'
	}
}