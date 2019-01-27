import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const getSettings = redux.action
(
	() => async () => localStorage.settings ? JSON.parse(localStorage.settings) : DEFAULT_SETTINGS,
	'settings'
)

export const saveSettings = redux.action
(
	(settings) => async () => localStorage.settings = JSON.stringify(settings)
)

export default redux.reducer()

const DEFAULT_SETTINGS = {
	filters: {
		ignoredWords: [
		  "пидора[шх].*",
		  "пыня",
		  "пыни",
		  "пыню",
		  "коммуняк",
		  "хуесос.*",
		  "карлан.*",
		  "блядски.*",
		  "выблядк.*",
		  "поебал.*",
		  "чмо",
		  "рашк.",
		  "рашко.*",
		  "ебар."
		],
		ignoredWordsCaseSensitive: [
	  	"РАБот.*"
		]
	}
}