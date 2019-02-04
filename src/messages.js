const RU_MESSAGES = {
	showBoardsList: 'Показать список досок',
	boardsList: 'Популярные',
	boardsByCategory: 'По разделам',
	thread: 'Тред',
	loadingBoardsError: 'Не удалось загрузить список досок',
	loadingThreadsError: 'Не удалось загрузить список тредов',
	loadingCommentsError: 'Не удалось загрузить сообщения треда',
	deletedPost: 'Удалённое сообщение',
	hiddenPost: 'Скрытое сообщение',
	quotedPost: 'Сообщение'
}

const EN_MESSAGES = {
	showBoardsList: 'Show boards list',
	boardsList: 'Popular',
	boardsByCategory: 'By category',
	thread: 'Thread',
	loadingBoardsError: 'Couldn\'t load boards list',
	loadingThreadsError: 'Couldn\'t load threads list',
	loadingCommentsError: 'Couldn\'t load thread comments',
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