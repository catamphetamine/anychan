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
		  "пидара[шх].*",
		  "пыня",
		  "пыни",
		  "пыню",
		  "коммуняк",
		  "хуесос.*",
		  "хуев",
		  "хуев.*",
		  "хуёв",
		  "хуёв.*",
		  "пизд.*",
		  "карлан.*",
		  "бляд.",
		  "бляд..",
		  "блядски.*",
		  "выблядк.*",
		  "поебал.*",
		  "ебал",
		  "ебал.*",
		  "перееб",
		  "переёб",
		  "перееб.*",
		  "уебан",
		  "уебан.*",
		  "долбоёб",
		  "долбоёб.*",
		  "чмо",
		  "рашк.",
		  "рашко.*",
		  "ебар.",
		  "ебар..",
		  "дебил",
		  "дебил.",
		  "дебил..",
		  "даун",
		  "даун.",
		  "даун..",
		  "говн.*",
		  "нуфан.",
		  "нюфан.",
		  "ньюфан.",
		  "сучар.",
		  "всратк.*",
		  "всратый",
		  "всрато.+",
		  "всрата.*"
		],
		ignoredWordsCaseSensitive: [
	  	"РАБот.*"
		]
	}
}