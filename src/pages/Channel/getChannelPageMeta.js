export default ({ data: { channel }}) => ({
	title: channel && ('/' + channel.id + '/' + ' — ' + channel.title),
	description: channel && channel.description
})