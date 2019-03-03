import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'
import Parser from './Parser'

describe('2ch.hk', () => {
	it('should parse comments', () => {
		const API_RESPONSE_1 = {
			"Board": "vg",
			"BoardInfo": "Доска для постоянных тредов по игре, которые предполагают длительное обсуждение (номерные треды). Для рандом-тредов в <a href=\"/v/\">/v/</a>. Конференция доски в Телеграме - <a href=\"https://telegram.me/ru2chvg\">@ru2chvg</a>",
			"BoardInfoOuter": "Видеоигры, general, официальные треды",
			"BoardName": "Video Games General",
			"default_name": "Аноним",
			"threads": [
				{
					"posts": [
						{
							"banned": 0,
							"closed": 0,
							"comment": "<strong>PLAYERUNKNOWN&#39;S BATTLEGROUNDS</strong> - это шутер в котором выигрывает последний оставшийся в живых участник. Начиная игру ни с чем, вы должны раздобыть оружие и припасы чтобы бороться за первое место и стать последним героем. Игра вышла из раннего доступа в конце 2017 года. Движок игры - UE4. Перед приобретением рекомендуется на просторах ютуба или твича познакомиться с игрой. <br>Недавно разработчики выпустили эвент пасс, который можно приобрести за 600 рублей и приступить к работе. Квесты жесткие. <br><br><span class=\"spoiler\">Ссылка на шапку треда - <a href=\"https:&#47;&#47;pastebin.com&#47;A9RjkRnv\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;pastebin.com&#47;A9RjkRnv</a></span><br><br>Своровать у Габена - <a href=\"http:&#47;&#47;store.steampowered.com&#47;app&#47;578080&#47;\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">http:&#47;&#47;store.steampowered.com&#47;app&#47;578080&#47;</a> <br>Своровать у мейлру - <a href=\"https:&#47;&#47;pubg.mail.ru\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;pubg.mail.ru</a><br><br>Статистика игроков - <a href=\"https:&#47;&#47;pubg.op.gg\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;pubg.op.gg</a><br><br>Сайт для просмотра реплеев, не заходя в игру - <a href=\"https:&#47;&#47;minmax.gg&#47;chickendinner\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;minmax.gg&#47;chickendinner</a><br><br>Роадмап от разработчиков на 2018 год:<br>На ангельском - <a href=\"https:&#47;&#47;fix.pubg.com&#47;\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;fix.pubg.com&#47;</a><br><br>Новости об игре из твиттера:<br><a href=\"https:&#47;&#47;twitter.net&#47;PUBG_help\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;twitter.net&#47;PUBG_help</a>",
							"date": "26/12/18 Срд 10:10:09",
							"email": "",
							"endless": 0,
							"files": [
								{
									"displayname": "vikendi1.png",
									"fullname": "vikendi1.png",
									"height": 1050,
									"md5": "097912a41f584ecce47859570c252cbf",
									"name": "15458082101590.png",
									"nsfw": 0,
									"path": "/vg/src/28727050/15458082101590.png",
									"size": 2787,
									"thumbnail": "/vg/thumb/28727050/15458082101590s.jpg",
									"tn_height": 136,
									"tn_width": 250,
									"type": 2,
									"width": 1920
								},
								{
									"displayname": "vikendi2.png",
									"fullname": "vikendi2.png",
									"height": 720,
									"md5": "e01dbe6fa3417dc9bc4f5bd93894c267",
									"name": "15458082101841.png",
									"nsfw": 0,
									"path": "/vg/src/28727050/15458082101841.png",
									"size": 439,
									"thumbnail": "/vg/thumb/28727050/15458082101841s.jpg",
									"tn_height": 140,
									"tn_width": 250,
									"type": 2,
									"width": 1280
								},
								{
									"displayname": "vikendi3.jpg",
									"fullname": "vikendi3.jpg",
									"height": 720,
									"md5": "d3cec1657c9137f515d9f02951dde24d",
									"name": "15458082101882.jpg",
									"nsfw": 0,
									"path": "/vg/src/28727050/15458082101882.jpg",
									"size": 73,
									"thumbnail": "/vg/thumb/28727050/15458082101882s.jpg",
									"tn_height": 140,
									"tn_width": 250,
									"type": 1,
									"width": 1280
								},
								{
									"displayname": "vikendi4.jpg",
									"fullname": "vikendi4.jpg",
									"height": 1080,
									"md5": "24853fa3646f12476a59eb69f2282bc0",
									"name": "15458082101893.jpg",
									"nsfw": 0,
									"path": "/vg/src/28727050/15458082101893.jpg",
									"size": 448,
									"thumbnail": "/vg/thumb/28727050/15458082101893s.jpg",
									"tn_height": 140,
									"tn_width": 250,
									"type": 1,
									"width": 1920
								}
							],
							"lasthit": 1548974878,
							"name": "Аноним",
							"num": 28727050,
							"number": 1,
							"op": 0,
							"parent": "0",
							"sticky": 0,
							"subject": "PLAYЕRUNKNОWNS BATTLЕGRОUNDS №82 VIKENDI EDITION",
							"tags": "pubg",
							"timestamp": 1545808209,
							"trip": ""
						},
						{
							"banned": 0,
							"closed": 0,
							"comment": "<a href=\"/vg/res/28727050.html#28942338\" class=\"post-reply-link\" data-thread=\"28727050\" data-num=\"28942338\">>>28942338</a><br><span class=\"spoiler\">&#47;YPJRKqv</span>",
							"date": "16/01/19 Срд 12:20:06",
							"email": "",
							"endless": 0,
							"files": [],
							"lasthit": 1548974878,
							"name": "Аноним",
							"num": 28942787,
							"number": 580,
							"op": 0,
							"parent": "28727050",
							"sticky": 0,
							"subject": "",
							"timestamp": 1547630406,
							"trip": ""
						},
						{
							"banned": 0,
							"closed": 0,
							"comment": "<a href=\"/vg/res/28727050.html#28942773\" class=\"post-reply-link\" data-thread=\"28727050\" data-num=\"28942773\">>>28942773</a><br>Не советую.",
							"date": "16/01/19 Срд 12:20:51",
							"email": "",
							"endless": 0,
							"files": [],
							"lasthit": 1548974878,
							"name": "Аноним",
							"num": 28942793,
							"number": 581,
							"op": 0,
							"parent": "28727050",
							"sticky": 0,
							"subject": "",
							"timestamp": 1547630451,
							"trip": ""
						},
						{
							"banned": 0,
							"closed": 0,
							"comment": "<a href=\"/vg/res/28727050.html#28942787\" class=\"post-reply-link\" data-thread=\"28727050\" data-num=\"28942787\">>>28942787</a><br>Это группа порядочных ?<br><a href=\"/vg/res/28727050.html#28942908\" class=\"post-reply-link\" data-thread=\"28727050\" data-num=\"28942908\">>>28942908</a><br>Ммм?<br><a href=\"/vg/res/28727050.html#28942793\" class=\"post-reply-link\" data-thread=\"28727050\" data-num=\"28942793\">>>28942793</a><br>А что там?",
							"date": "16/01/19 Срд 12:47:03",
							"email": "",
							"endless": 0,
							"files": [],
							"lasthit": 1548974878,
							"name": "Аноним",
							"num": 28943045,
							"number": 582,
							"op": 0,
							"parent": "28727050",
							"sticky": 0,
							"subject": "",
							"timestamp": 1547632023,
							"trip": ""
						}
					]
				}
			]
		}

		const COMMENTS = [
			{
				"id": 28727050,
				"title": "PLAYЕRUNKNОWNS BATTLЕGRОUNDS №82 VIKENDI EDITION",
				"textPreview": "PLAYERUNKNOWN'S BATTLEGROUNDS — это шутер в котором выигрывает последний оставшийся в живых участник.",
				"content": [
					[
						{
							"type": "text",
							"style": "bold",
							"content": "PLAYERUNKNOWN'S BATTLEGROUNDS"
						},
						" — это шутер в котором выигрывает последний оставшийся в живых участник. Начиная игру ни с чем, вы должны раздобыть оружие и припасы чтобы бороться за первое место и стать последним героем. Игра вышла из раннего доступа в конце 2017 года. Движок игры — UE4. Перед приобретением рекомендуется на просторах ютуба или твича познакомиться с игрой. ",
						"\n",
						"Недавно разработчики выпустили эвент пасс, который можно приобрести за 600 рублей и приступить к работе. Квесты жесткие."
					],
					[
						{
							"type": "spoiler",
							"content": [
								"Ссылка на шапку треда — ",
								{
									"type": "link",
									"content": "pastebin.com/A9RjkRnv",
									"url": "https://pastebin.com/A9RjkRnv",
									autogenerated: true
								}
							]
						}
					],
					[
						"Своровать у Габена — ",
						{
							"type": "link",
							"content": "store.steampowered.com/app/578080",
							"url": "http://store.steampowered.com/app/578080/",
							autogenerated: true
						},
						" ",
						"\n",
						"Своровать у мейлру — ",
						{
							"type": "link",
							"content": "pubg.mail.ru",
							"url": "https://pubg.mail.ru",
							autogenerated: true
						}
					],
					[
						"Статистика игроков — ",
						{
							"type": "link",
							"content": "pubg.op.gg",
							"url": "https://pubg.op.gg",
							autogenerated: true
						}
					],
					[
						"Сайт для просмотра реплеев, не заходя в игру — ",
						{
							"type": "link",
							"content": "minmax.gg/chickendinner",
							"url": "https://minmax.gg/chickendinner",
							autogenerated: true
						}
					],
					[
						"Роадмап от разработчиков на 2018 год:",
						"\n",
						"На ангельском — ",
						{
							"type": "link",
							"content": "fix.pubg.com",
							"url": "https://fix.pubg.com/",
							autogenerated: true
						}
					],
					[
						"Новости об игре из твиттера:",
						"\n",
						{
							"type": "link",
							"content": "twitter.net/PUBG_help",
							"url": "https://twitter.net/PUBG_help",
							autogenerated: true
						}
					]
				],
				"inReplyTo": [],
				"attachments": [
					{
						"type": "picture",
						"size": 2853888,
						"picture": {
							"type": "image/png",
							"sizes": [
								{
									"width": 250,
									"height": 136,
									"url": "//2ch.hk/vg/thumb/28727050/15458082101590s.jpg"
								},
								{
									"width": 1920,
									"height": 1050,
									"url": "//2ch.hk/vg/src/28727050/15458082101590.png"
								}
							]
						}
					},
					{
						"type": "picture",
						"size": 449536,
						"picture": {
							"type": "image/png",
							"sizes": [
								{
									"width": 250,
									"height": 140,
									"url": "//2ch.hk/vg/thumb/28727050/15458082101841s.jpg"
								},
								{
									"width": 1280,
									"height": 720,
									"url": "//2ch.hk/vg/src/28727050/15458082101841.png"
								}
							]
						}
					},
					{
						"type": "picture",
						"size": 74752,
						"picture": {
							"type": "image/jpeg",
							"sizes": [
								{
									"width": 250,
									"height": 140,
									"url": "//2ch.hk/vg/thumb/28727050/15458082101882s.jpg"
								},
								{
									"width": 1280,
									"height": 720,
									"url": "//2ch.hk/vg/src/28727050/15458082101882.jpg"
								}
							]
						}
					},
					{
						"type": "picture",
						"size": 458752,
						"picture": {
							"type": "image/jpeg",
							"sizes": [
								{
									"width": 250,
									"height": 140,
									"url": "//2ch.hk/vg/thumb/28727050/15458082101893s.jpg"
								},
								{
									"width": 1920,
									"height": 1080,
									"url": "//2ch.hk/vg/src/28727050/15458082101893.jpg"
								}
							]
						}
					}
				],
				"createdAt": new Date("2018-12-26T07:10:09.000Z")
			},
			{
				"id": 28942787,
				"content": [
					[
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 28727050,
							"postId": 28942338,
							"content": "Удалённое сообщение",
							"url": "#comment-28942338",
							"postWasDeleted": true
						},
						"\n",
						{
							"type": "spoiler",
							"content": "/YPJRKqv"
						}
					]
				],
				"inReplyTo": [
					28942338
				],
				"attachments": [],
				"createdAt": new Date("2019-01-16T09:20:06.000Z"),
				"replies": [
					28943045
				]
			},
			{
				"id": 28942793,
				"content": [
					[
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 28727050,
							"postId": 28942773,
							"content": "Удалённое сообщение",
							"url": "#comment-28942773",
							"postWasDeleted": true
						},
						"\n",
						"Не советую."
					]
				],
				"inReplyTo": [
					28942773
				],
				"attachments": [],
				"createdAt": new Date("2019-01-16T09:20:51.000Z"),
				"replies": [
					28943045
				]
			},
			{
				"id": 28943045,
				"content": [
					[
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 28727050,
							"postId": 28942787,
							"content": "Сообщение",
							"quote": "…",
							"quoteAutogenerated": true,
							"url": "#comment-28942787"
						},
						"\n",
						"Это группа порядочных?",
						"\n",
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 28727050,
							"postId": 28942908,
							"content": "Удалённое сообщение",
							"url": "#comment-28942908",
							"postWasDeleted": true
						},
						"\n",
						"Ммм?",
						"\n",
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 28727050,
							"postId": 28942793,
							"content": "Сообщение",
							"quote": "Не советую.",
							"quoteAutogenerated": true,
							"url": "#comment-28942793"
						},
						"\n",
						"А что там?"
					]
				],
				"inReplyTo": [
					28942787,
					28942908,
					28942793
				],
				"attachments": [],
				"createdAt": new Date("2019-01-16T09:47:03.000Z")
			}
		]

		expectToEqual(
			new Parser({
				messages: {
					deletedPost: 'Удалённое сообщение',
					hiddenPost: 'Скрытое сообщение',
					quotedPost: 'Сообщение'
				}
			}).parseComments(API_RESPONSE_1, { boardId: 'vg' }),
			COMMENTS
		)
	})
})