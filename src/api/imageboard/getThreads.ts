import type { Imageboard, Thread as ImageboardThread } from 'imageboard';
import type { ThreadFromDataSource, GetThreadsParameters, GetThreadsResult, ChannelFromDataSource } from '../../types/index.js'

import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'

const MAX_LATEST_COMMENTS_PAGES_COUNT = 2

export default async function getThreadsFromImageboard(imageboard: Imageboard, {
	channelId,
	channelLayout,
	withLatestComments,
	sortBy,
	dataSourceId
}: GetThreadsParameters): Promise<GetThreadsResult> {
	const {
		threads: threads_,
		board
	 } = await imageboard.getThreads({
		boardId: channelId,
		// The parser parses `thread.comments` up to 4x faster when it skips parsing their `.content`.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false,
		// Add `.parseContent()` function to each `comment`.
		addParseContent: true,
		commentLengthLimit: getCommentLengthLimit({ mode: 'channel', channelLayout }),
		commentLengthLimitForWithLatestComments: getCommentLengthLimit({ mode: 'thread' }),
		withLatestCommentsMaxPages: withLatestComments ? MAX_LATEST_COMMENTS_PAGES_COUNT : undefined,
		withLatestComments,
		sortBy: sortBy === 'rating-desc' ? sortBy : undefined
	})

	// Added this assignment in order to work around TypeScript type errors.
	let channel: ChannelFromDataSource | undefined = board

	// Added this assignment in order to work around TypeScript type errors.
	// It will remove some properties specific to `imageboard` `Thread`
	// and it will add some properties specific to `anychan` Thread.
	let threads = threads_ as (ThreadFromDataSource & ImageboardThread)[]

	// Rename `thread.boardId` -> `thread.channelId`.
	// `thread.boardId` is set by `imageboard` library.
	// `thread.channelId` is used in this application.
	for (const thread of threads) {
		if (thread.boardId) {
			thread.channelId = thread.boardId
			delete thread.boardId
		}
	}

	// Clear author name if it's a default one for the board.
	// Example: "Anonymous".
	if (channel && channel.features?.defaultAuthorName) {
		for (const thread of threads) {
			for (const comment of thread.comments) {
				if (comment.authorName === channel.features.defaultAuthorName) {
					comment.authorName = undefined
				}
			}
		}
	}

	// On `2ch.hk`, there's a bug when `/d/catalog.json` doesn't return the threads.
	// It used to return an empty list of threads, now (May 2023) it returns a single one.
	// Work around that a bit by adding two sticky threads.
	if (dataSourceId === '2ch') {
		if (channelId === 'd' && threads.length < 2) {
			if (!threads.find(_ => _.id === TWO_CHANNEL_D_BOARD_FAG_BOARD_BUGS_AND_FEATURES_THREAD.id)) {
				// @ts-expect-error
				threads = [TWO_CHANNEL_D_BOARD_FAG_BOARD_BUGS_AND_FEATURES_THREAD].concat(threads)
			}
			if (!threads.find(_ => _.id === TWO_CHANNEL_D_BOARD_BUGS_AND_FEATURES_THREAD.id)) {
				// @ts-expect-error
				threads = [TWO_CHANNEL_D_BOARD_BUGS_AND_FEATURES_THREAD].concat(threads)
			}
			if (!threads.find(_ => _.id === TWO_CHANNEL_D_BOARD_OVERALL_THREAD.id)) {
				// @ts-expect-error
				threads = [TWO_CHANNEL_D_BOARD_OVERALL_THREAD].concat(threads)
			}
		}
	}

	return {
		threads,
		hasMoreThreads: false,
		channel
	}
}

const TWO_CHANNEL_D_BOARD_BUGS_AND_FEATURES_THREAD: ThreadFromDataSource = {
	"id": 421281,
	"channelId": "d",
	"commentsCount": 501,
	"attachmentsCount": 0,
	"createdAt": new Date("2017-01-15T14:59:57.000Z"),
	"updatedAt": new Date("2023-05-23T21:59:29.000Z"),
	"uniquePostersCount": 298,
	"pinned": true,
	"pinnedOrder": 934,
	"trimming": true,
	"bumpLimitReached": false,
	"title": "Тред о багах и фичах на Дваче",
	"comments": [
		{
			"id": 421281,
			"content": [
				[
					"Просьба репортить сюда баги в дизайне и работе имиджборда.",
					"\n",
					"Репортить баги желательно развернуто, с картиночками и указанием версии браузера."
				],
				[
					"Алсо, если хотите какую-то фичу, новый функционал и т.д. тоже пишите сюда. Автор крутой идеи, которую мы реализуем, получит пасскод в подарок."
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "Q:"
					},
					" Сломалось избранное, что делать?"
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "A:"
					},
					" Store.del('favorites') в js консоли браузера"
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "Q:"
					},
					" Не работает *ЧТО-ТО* или сломалось *ЧТО-ТО* и у меня стоит кукла"
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "A:"
					},
					" Идешь мимо треда"
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "Q:"
					},
					" А БЛЯ МАКАКА ЧИНИ ПЛЕЕР УИИ"
				],
				[
					{
						"type": "text",
						"style": "bold",
						"content": "A:"
					},
					" chrome://flags/#enable-modern-media-controls переведи в состояние disabled"
				]
			],
			"createdAt": new Date("2017-01-15T14:59:57.000Z"),
			"title": "Тред о багах и фичах на Дваче",
			"upvotes": 1835,
			"downvotes": 1590,
			"authorIsThreadAuthor": true
		}
	]
}

const TWO_CHANNEL_D_BOARD_OVERALL_THREAD: ThreadFromDataSource = {
	"id": 451903,
	"channelId": "d",
	"commentsCount": 486,
	"attachmentsCount": 0,
	"uniquePostersCount": 236,
	"pinned": true,
	"pinnedOrder": 933,
	"trimming": true,
	"hasAuthorIds": true,
	"createdAt": new Date("2017-05-16T13:38:07.000Z"),
	"updatedAt": new Date("2023-05-23T21:30:03.000Z"),
	"title": "Не плодите однотипные треды, отпишитесь со своей проблемой здесь.",
	"autogeneratedTitle": "Не плодите однотипные треды, отпишитесь со своей проблемой здесь.",
	"titleCensoredContent": "Не плодите однотипные треды, отпишитесь со своей проблемой здесь.",
	"titleCensored": "Не плодите однотипные треды, отпишитесь со своей проблемой здесь.",
	"comments": [
		{
			"id": 451903,
			"content": [
				[
					"Н",
					"е плодите однотипные треды, отпишитесь со своей проблемой здесь."
				],
				[
					"С жалобой на модерацию, несправедливым баном, репортом тредов обращайтесь в этот тред или в дискорд ",
					{
						"type": "link",
						"url": "https://discord.gg/2ch",
						"service": "discord",
						"content": "2ch",
						"contentGenerated": true
					},
					" в раздел d.",
					"\n",
					"Любители почятиться и/или использовать тред для собственного увеселения будут удаляться, а при регулярном рецидиве будут баниться. Не засирайте технический тред, молодые люди, он не для этого прикреплён.",
					"\n",
					"С проблемами и багами в дизайне или работе имиджборды обращайтесь в Тред о багах и фичах на Дваче ",
					{
						"type": "post-link",
						"meta": {
							"commentId": 421281,
							"threadId": 421281,
							"channelId": "d",
							"isAnotherThread": true
						},
						"content": "Тред",
						"url": "/d/421281",
						// @ts-expect-error
						"_id": 1
					}
				],
				[
					"Тред для всех вопросов по разделу /fag/  ",
					{
						"type": "post-link",
						"meta": {
							"commentId": 857787,
							"threadId": 857787,
							"channelId": "d",
							"isAnotherThread": true
						},
						"content": "Тред",
						"url": "/d/857787",
						// @ts-expect-error
						"_id": 2
					},
					", ИТТ жалобы на этот раздел не рассматриваются."
				]
			],
			"createdAt": new Date("2017-05-16T13:38:07.000Z"),
			"upvotes": 13313,
			"downvotes": 30181,
			"authorRole": "moderator",
			"authorIsThreadAuthor": true,
			"isRootComment": true,
			"commentsCount": 486,
			"attachmentsCount": 0,
			"uniquePostersCount": 236,
			"pinned": true,
			"index": 0,
			"threadHasAuthorIds": true,
			"viewingMode": "thread",
			"vote": false,
			"channelIdForCountryFlag": "d",
			"_removedLeadingOriginalPostQuote": true,
			"textPreviewForPageDescription": "Не плодите однотипные треды, отпишитесь со своей проблемой здесь.\nС жалобой на модерацию, несправедливым баном, репортом тредов обращайтесь в этот тред или в дискорд"
		}
	]
}

const TWO_CHANNEL_D_BOARD_FAG_BOARD_BUGS_AND_FEATURES_THREAD: ThreadFromDataSource = {
	"id": 857787,
	"channelId": "d",
	"commentsCount": 501,
	"attachmentsCount": 0,
	"createdAt": new Date("2021-06-23T10:16:23.000Z"),
	"updatedAt": new Date("2023-05-23T22:14:21.000Z"),
	"uniquePostersCount": 234,
	"pinned": true,
	"pinnedOrder": 935,
	"trimming": true,
	"bumpLimitReached": false,
	"title": "Тред для жалоб и предложений раздела /fag/",
	"comments": [
		{
			"id": 857787,
			"content": [
				[
					"Тред для жалоб и предложений раздела /fag/",
					"\n",
					"С любыми проблемами и вопросами, банами и обсуждением модерации раздела писать сюда."
				]
			],
			"createdAt": new Date("2021-06-23T10:16:23.000Z"),
			"title": "Тред для жалоб и предложений раздела /fag/",
			"upvotes": 197,
			"downvotes": 382,
			"authorRole": "moderator",
			"authorIsThreadAuthor": true
		}
	]
}

function transformSnapshottedThread(thread: ThreadFromDataSource) {
	thread.comments[0].parseContent = () => {}
	thread.comments[0].hasContentBeenParsed = () => true
	thread.comments[0].createdAt = new Date(thread.comments[0].createdAt)
	thread.createdAt = new Date(thread.createdAt)
	thread.updatedAt = new Date(thread.updatedAt)
}

transformSnapshottedThread(TWO_CHANNEL_D_BOARD_OVERALL_THREAD)
transformSnapshottedThread(TWO_CHANNEL_D_BOARD_BUGS_AND_FEATURES_THREAD)
transformSnapshottedThread(TWO_CHANNEL_D_BOARD_FAG_BOARD_BUGS_AND_FEATURES_THREAD)