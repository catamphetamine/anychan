export default function getChannelPageMeta({ data: { channel }}) {
	return {
		title: channel && ('/' + channel.id + '/' + ' — ' + channel.title),
		description: channel && channel.description
	}
}