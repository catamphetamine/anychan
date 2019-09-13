import parseAttachment from './parseAttachment'

export default function parseAttachments(post, options) {
	if (!post.ext && !post.extra_files) {
		return
	}
	let files = []
	if (post.ext) {
		files.push(post)
	}
	// `kohlchan.net` and `8ch.net` have "extra_files".
	if (post.extra_files) {
		files = files.concat(post.extra_files)
	}
	return files.filter(file => !wasAttachmentDeleted(file, options))
		// On `8ch.net` sometimes a `file` can be just `[]` (which is a bug).
		// For example, one time there was a thread with `extra_files: [ [] ]`.
		// https://github.com/OpenIB/OpenIB/issues/298
		.filter(_ => !Array.isArray(_))
		.map(file => parseAttachment(file, options))
}

function wasAttachmentDeleted(file, { chan }) {
	// `4chan.org` and `kohlchan.net` use `"filedeleted": 0/1`.
	// In case of `"filedeleted": 1` it seems that all file-related
	// properties are also removed from the comment, so
	// strictly speaking there's no need to filter in this case.
	if (file.filedeleted === 1) {
		return true
	}
	// `8ch.net` seems to use `"ext": "deleted"` instead of `"filedeleted": 1`.
	if (chan === '8ch' && file.ext === 'deleted') {
		return true
	}
	return false
}