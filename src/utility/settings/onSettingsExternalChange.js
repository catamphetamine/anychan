import { getSettings } from '../../redux/settings.js'
import applySettings from './applySettings.js'

export default function onSettingsExternalChange({ dispatch, userSettings }) {
	dispatch(getSettings({ userSettings }))
	applySettings({ dispatch, userSettings })
}