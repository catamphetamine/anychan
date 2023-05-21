export default function getChannelPageMeta({ useSelector }) {
	const channel = useSelector(state => state.data.channel)
	return {
		title: channel && ('/' + channel.id + '/' + ' — ' + channel.title),
		description: channel && channel.description
	}
}