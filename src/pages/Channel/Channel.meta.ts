import type { usePageStateSelector as usePageStateSelector_ } from '@/hooks'

export default function getChannelPageMeta({ usePageStateSelector }: { usePageStateSelector: typeof usePageStateSelector_ }) {
	const channel = usePageStateSelector('channel', state => state.channel.channel)
	return {
		title: channel && ('/' + channel.id + '/' + (channel.title ? ' — ' + channel.title : '')),
		description: channel && channel.description
	}
}