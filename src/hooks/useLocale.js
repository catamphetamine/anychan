import { useSelector } from 'react-redux'

export default function useLocale() {
	return useSelector(state => state.settings.settings.locale)
}