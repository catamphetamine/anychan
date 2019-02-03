const RU_MESSAGES = {
	boardsList: 'Популярные',
	boardsByCategory: 'По разделам',
	thread: 'Тред',
	deletedPost: 'Удалённое сообщение',
	hiddenPost: 'Скрытое сообщение',
	quotedPost: 'Сообщение'
}

const EN_MESSAGES = {
	boardsList: 'Popular',
	boardsByCategory: 'By category',
	thread: 'Thread',
	deletedPost: 'Deleted message',
	hiddenPost: 'Hidden message',
	quotedPost: 'Message'
}

export default function getMessages(language) {
	switch (language) {
		case 'ru':
			return RU_MESSAGES
		case 'en':
			return EN_MESSAGES
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}