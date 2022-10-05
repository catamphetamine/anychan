import { getSettings } from '../../redux/settings.js'
import applySettings from './applySettings.js'

export default function onSettingsExternalChange({ dispatch }) {
	dispatch(getSettings())
	applySettings({ dispatch })
}