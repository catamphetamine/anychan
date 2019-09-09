import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'
import Parser from './Parser'

import FourChannel from '../../chan/4chan/index.json'

describe('4chan.org', () => {
	it('should parse threads', () => {
		const API_RESPONSE = [{
			"page": 1,
			"threads": [{
				"no": 2952650,
				"now": "02\/01\/19(Fri)01:37:01",
				"name": "Anonymous",
				"sub": "\/stg\/- Slave Trainer General\/Maledom general",
				"com": "Embrace the 2d edition<br><br>HIS GENERAL ISN&#039;T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification).<br><br>This is a general about slave trainer games and the creation of games where you play as a male and dominate women. Discussion about games not being created here is also acceptable as long as it&#039;s related to the topic at hand(i.e. playing a male and dominating women). Futa belongs in weg not here. If it has a dick it&#039;s not a woman.<br><br>If you&#039;re working on a game and want to list a pastebin here speak up please.<br><br>WIP Projects (Korra Trainer, Four Elements Trainer, WT Silver, Tifa Trainer, Incredibles Trainer, Ben ten trainer, Momcest trainer, Fantasy Trainer, etc):<br>https:\/\/pastebin.com\/G7Z6gtVH<br>If I forgot you please mention it<br><br>Maverick wrote a guide for scripting. Shows how to write\/structure scenes for coders. Good for idea-guys &amp; script-writers:<br>http:\/\/pastebin.com\/gRyrGgDt (embed) (embed)<br>Contact info for major contributors:<br>https:\/\/quip.com\/I2f8AaPEEr0a<br>Some of these people are looking for writers and artists. If you&#039;re interested mention it.<br><br>Report &amp; ignore shitposters, people that scream proxyfag\/samefag\/waifu\/waifufag, people that post beast, and futa spammers<br><br><span class=\"quote\">&gt;Previous thread: <a href=\"\/aco\/thread\/2943071#p2943071\" class=\"quotelink\">&gt;&gt;2943071<\/a><\/span>",
				"filename": "1549002781612",
				"ext": ".png",
				"w": 1280,
				"h": 720,
				"tn_w": 250,
				"tn_h": 140,
				"tim": 1549003021750,
				"time": 1549003021,
				"md5": "ILcdVNffdQ9d+0By4YVBEQ==",
				"fsize": 1142977,
				"resto": 0,
				"bumplimit": 0,
				"imagelimit": 0,
				"semantic_url": "stg-slave-trainer-generalmaledom-general",
				"replies": 193,
				"images": 36,
				"omitted_posts": 188,
				"omitted_images": 31,
				"last_replies": [{
					"no": 2958911,
					"now": "02\/03\/19(Sun)15:19:21",
					"name": "Anonymous",
					"com": "<a href=\"#p2958896\" class=\"quotelink\">&gt;&gt;2958896<\/a><br>i name my projects &quot;Project XX&quot; where XX is a number of a project<br>but i dont make games",
					"time": 1549225161,
					"resto": 2952650
				}, {
					"no": 2958913,
					"now": "02\/03\/19(Sun)15:20:56",
					"name": "Anonymous",
					"com": "someone have the most up to date faulty apprentice download? 1.0.3 came out recently",
					"time": 1549225256,
					"resto": 2952650
				}, {
					"no": 2958914,
					"now": "02\/03\/19(Sun)15:21:05",
					"name": "Anonymous",
					"com": "<a href=\"#p2958911\" class=\"quotelink\">&gt;&gt;2958911<\/a><br>maybe ill just call it &quot;unfinished project 20&quot; and when i&#039;m done &quot;finished project 1&quot;",
					"time": 1549225265,
					"resto": 2952650
				}, {
					"no": 2958915,
					"now": "02\/03\/19(Sun)15:21:38",
					"name": "Anonymous",
					"com": "<a href=\"#p2958896\" class=\"quotelink\">&gt;&gt;2958896<\/a><br><span class=\"quote\">&gt;[thematic fetish related thing evoking your core concept] trainer <\/span><br><span class=\"quote\">&gt;[porn related wording] [idea]<\/span><br>there aren&#039;t exactly hard rules here <br><br>tags, the description, and word of mouth are going to do most of the heavily lifting. A good title isn&#039;t always a descriptive title. things like alliteration can cement it into a persons mind even if they have no idea what the game is about.",
					"time": 1549225298,
					"resto": 2952650
				}, {
					"no": 2958917,
					"now": "02\/03\/19(Sun)15:22:36",
					"name": "Anonymous",
					"com": "<a href=\"#p2958915\" class=\"quotelink\">&gt;&gt;2958915<\/a><br><span class=\"quote\">&gt;[porn related wording] [idea]<\/span><br>I&#039;m going to make a game and call it Blowjob Idea.<br>Thank you, anon.",
					"time": 1549225356,
					"resto": 2952650
				}],
				"last_modified": 1549225356
			}]
		}]

		const THREADS = [
			{
				"board": {
					"id": "a"
				},
				"id": 2952650,
				"title": "/stg/- Slave Trainer General/Maledom general",
				"createdAt": new Date("2019-02-01T06:37:01.000Z"),
				"updatedAt": new Date(1549225356 * 1000),
				"commentsCount": 193,
				"commentAttachmentsCount": 36,
				"comments" : [
					{
						"id": 2952650,
						// This is a post from "previous thread" so
						// technically it's not an "in reply to" one.
						// "inReplyTo": [
						// 	2943071
						// ],
						"attachments": [
							{
								"type": "picture",
								"picture": {
									"type": "image/png",
									"width": 1280,
									"height": 720,
									"size": 1142977,
									"url": "https://i.4cdn.org/a/1549003021750.png",
									"sizes": [
										{
											"type": "image/jpeg",
											"width": 250,
											"height": 140,
											"url": "https://i.4cdn.org/a/1549003021750s.jpg"
										}
									]
								}
							}
						],
						"createdAt": new Date("2019-02-01T06:37:01.000Z"),
						"title": "/stg/- Slave Trainer General/Maledom general",
						"content": [
							[
								"Embrace the 2d edition"
							],
							[
								"HIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification)."
							],
							[
								"This is a general about slave trainer games and the creation of games where you play as a male and dominate women. Discussion about games not being created here is also acceptable as long as it's related to the topic at hand(i.e. playing a male and dominating women). Futa belongs in weg not here. If it has a dick it's not a woman."
							],
							[
								"If you're working on a game and want to list a pastebin here speak up please."
							],
							[
								"WIP Projects (Korra Trainer, Four Elements Trainer, WT Silver, Tifa Trainer, Incredibles Trainer, Ben ten trainer, Momcest trainer, Fantasy Trainer, etc):",
								"\n",
								{
									"type": "link",
									"url": "https://pastebin.com/G7Z6gtVH",
									"content": "pastebin.com/G7Z6gtVH",
									autogenerated: true
								},
								"\n",
								"If I forgot you please mention it"
							],
							[
								"Maverick wrote a guide for scripting. Shows how to write/structure scenes for coders. Good for idea-guys & script-writers:",
								"\n",
								{
									"type": "link",
									"url": "http://pastebin.com/gRyrGgDt",
									"content": "pastebin.com/gRyrGgDt",
									autogenerated: true
								},
								" (embed) (embed)",
								"\n",
								"Contact info for major contributors:",
								"\n",
								{
									"type": "link",
									"url": "https://quip.com/I2f8AaPEEr0a",
									"content": "quip.com/I2f8AaPEEr0a",
									autogenerated: true
								},
								"\n",
								"Some of these people are looking for writers and artists. If you're interested mention it."
							],
							[
								"Report & ignore shitposters, people that scream proxyfag/samefag/waifu/waifufag, people that post beast, and futa spammers"
							],
							[
								{
									"type": "quote",
									"content": [
										"Previous thread: ",
										{
											"type": "post-link",
											"boardId": "aco",
											"threadId": 2943071,
											"postId": 2943071,
											"content": "Сообщение",
											"url": "/aco/2943071#2943071"
										}
									]
								}
							]
						]
					}
				]
			}
		]

		expectToEqual(
			new Parser(FourChannel, {
				messages: {
					deletedComment: 'Удалённое сообщение',
					hiddenComment: 'Скрытое сообщение',
					quotedComment: 'Сообщение'
				},
				getUrl(board, thread, comment) {
					return `/${board.id}/${thread.id}#${comment.id}`
				}
			}).parseThreads(API_RESPONSE, {
				boardId: 'a'
			}),
			THREADS
		)
	})
})