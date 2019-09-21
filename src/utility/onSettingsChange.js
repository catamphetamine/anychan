import { getSettings } from '../redux/settings'
import Settings from './settings'

export default function onSettingsChange(dispatch) {
	dispatch(getSettings())
	Settings.apply({ dispatch })
}