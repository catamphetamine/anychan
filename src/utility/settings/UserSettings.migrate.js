// The `version` of a user's "User Settings" is stored in `version` property in `localStorage`.
// The latest version of "User Settings" is `VERSION` in `UserData.js`.
export default function migrate(settings, version = 0) {
	// Version 1.
	// Dec 24, 2019.
	// Renamed `fontSize`s: "small", "medium", "large" -> "xs", "s", "m", "l", "xl".
	if (version < 1) {
		if (settings.fontSize) {
			settings.fontSize = migrateFontSize(settings.fontSize)
		}
	}
	// Version 2.
	// Dec 22, 2020.
	// Renamed `board` -> `channel`.
	if (version < 2) {
		if (settings.boardsView) {
			settings.channelsView = settings.boardsView
			delete settings.boardsView
		}
		if (settings.autoSuggestFavoriteBoards !== undefined) {
			settings.autoSuggestFavoriteChannels = settings.autoSuggestFavoriteBoards
			delete settings.autoSuggestFavoriteBoards
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