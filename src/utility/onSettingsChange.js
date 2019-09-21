import { getSettings } from '../redux/app'
import Settings from './settings'

export default function onSettingsChange(dispatch) {
	dispatch(getSettings())
	Settings.apply({ dispatch })
}