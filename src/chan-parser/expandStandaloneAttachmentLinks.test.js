import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'

describe('expandStandaloneAttachmentLinks', () => {
	it('should expand standalone attachment links in the end', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					},
					'abc',
					'\n',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						{
							type: 'link',
							attachment: {}
						},
						'abc'
					],
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					}
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should expand standalone attachment links in the beginning', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					},
					'\n',
					'abc',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					},
					[
						'abc',
						{
							type: 'link',
							attachment: {}
						}
					]
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should expand standalone attachment links when they are standalone', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					}
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should skip non-text paragraphs', () => {
		const post = {
			content: [
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					{
						type: 'link',
						attachment: {}
					},
					'abc',
					'\n',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: [{
				id: 1
			}]
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						{
							type: 'link',
							attachment: {}
						},
						'abc'
					],
					{
						type: 'attachment',
						attachmentId: 2,
						fit: 'height'
					}
				],
				attachments: [{
					id: 1
				}, {
					id: 2
				}]
			}
		)
	})

	it('should not expand non-standalone attachment links when there\'s text before them', () => {
		const post = {
			content: [
				[
					'abc — ',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						'abc — ',
						{
							type: 'link',
							attachment: {}
						}
					]
				],
				attachments: []
			}
		)
	})

	it('should expand standalone attachment links in a complex comment', () => {
		const post = {
			"id": 243005191,
			"inReplyTo": [],
			"attachments": [
				{
					"type": "picture",
					"size": 325646,
					"picture": {
						"type": "image/png",
						"sizes": [
							{
								"width": 192,
								"height": 250,
								"url": "//i.4cdn.org/vg/1549230474936s.jpg"
							},
							{
								"width": 1000,
								"height": 1300,
								"url": "//i.4cdn.org/vg/1549230474936.png"
							}
						]
					}
				},
				{
					"id": 1,
					"type": "video",
					"video": {
						"title": "RuneScape in 2019 - an introduction",
						"description": "Grab the best-value RuneScape membership package, Premier Club, here: rs.game/PremierClubYT\n\nSo, 2019, what have you got? In this introductory video to next year, we'll be showcasing what you can expect from RuneScape in the next 3-4 months - including:\n\n- The Mining and Smithing Rework\n- Elite Dungeon 3, featuring the Ambassador\n- Comp Cape Rework\n- Player-owned Farm improvements\n- Changes to Firemaking \n- PvM Quality of Life week\n- Double XP Weekend date\n- ...and loads more!\n\nMobile Christmas update Dev Blog: https://rs.game/MobileDevBlogXmas18\n\nJoin our other communities! Join us on:\nTwitch - http://www.twitch.tv/runescape\nReddit - http://www.reddit.com/r/runescape\nTwitter - http://twitter.com/runescape\nFacebook - http://www.facebook.com/runescape\nwww.runescape.com",
						"duration": 536,
						"aspectRatio": 1.7777777777777777,
						"picture": {
							"type": "image/jpeg",
							"sizes": [
								{
									"url": "https://i.ytimg.com/vi/P8seXaqhrO8/mqdefault.jpg",
									"width": 320,
									"height": 180
								},
								{
									"url": "https://i.ytimg.com/vi/P8seXaqhrO8/maxresdefault.jpg",
									"width": 1280,
									"height": 720
								}
							]
						},
						"width": 1280,
						"height": 720,
						"source": {
							"provider": "YouTube",
							"id": "P8seXaqhrO8"
						}
					}
				},
				{
					"id": 2,
					"type": "video",
					"video": {
						"title": "RuneScape Winter Reveals (RuneFest 2018) - RS Mobile, Til Death Do Us Part, Elite dungeons & More",
						"description": "\"This is the video you've all been waiting for - the RuneScape 2018 announcements!\n\nHold on to your seats: There's an exclusive look at the special Halloween event \"\"Til Death Do Us Part\"\", the Needle Skips quest, the Alchemical Onyx items, a real Achievements Bonanza, the reveal of Elite Dungeons 3, the Mining & Smithing rework and more.... oh and we forgot, this 'tiny little thing' called RS Mobile!!\n\nThe RuneScape Mobile Android Members' Limited Beta kicks off this Monday (8th October). Are you in?\n\n\n1:45 Til' Death Do Us Part\n6:40 - The Needle Skips\n10:00 - Elite Dungeon 3 \n14:25 - Alchemical Onyx\n19:10 - Achievement Bonanza\n22:00 - Game Jam\n24:16 - Mining and Smithing Rework \n29:10 - Violet is Blue\n32:43 - RS Mobile\n\n\n\n#RuneFest2018 #RuneScape #RSMobile #EliteDungeons #MMORPG",
						"duration": 2092,
						"aspectRatio": 1.7777777777777777,
						"picture": {
							"type": "image/jpeg",
							"sizes": [
								{
									"url": "https://i.ytimg.com/vi/kYn1hnGj8oI/mqdefault.jpg",
									"width": 320,
									"height": 180
								},
								{
									"url": "https://i.ytimg.com/vi/kYn1hnGj8oI/maxresdefault.jpg",
									"width": 1280,
									"height": 720
								}
							]
						},
						"width": 1280,
						"height": 720,
						"source": {
							"provider": "YouTube",
							"id": "kYn1hnGj8oI"
						}
					}
				}
			],
			"createdAt": new Date("2019-02-03T21:47:54.000Z"),
			"subject": "/rsg/ - RuneScape General",
			"content": [
				[
					"Hold still, invader!",
					"\n",
					"\n",
					"Previous thread: ",
					{
						"type": "post-link",
						"boardId": "vg",
						"threadId": 242722274,
						"postId": 242722274,
						"content": "Сообщение",
						"url": "/vg/242722274#comment-242722274"
					},
					"\n",
					"\n",
					"Official World: 42",
					"\n",
					"Official FC: \"grindanfc\"",
					"\n",
					"Clan: GrindanScape (For an invite, go into the FC and ask for one. Requirements: 1500 total, Membership, at least one week active play)",
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "/rsg/ Guides Imgur Album"
					},
					"\n",
					{
						"type": "link",
						"url": "https://imgur.com/a/05f8m",
						"content": "imgur.com/a/05f8m"
					},
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "Beastmaster Durzag and Yakamaru indepth guide"
					},
					"\n",
					{
						"type": "link",
						"url": "https://docs.google.com/document/d/1TJxAq1knHKqxefud_MbEuDEnpIJnep2ZwPn9A4A4PU4/",
						"content": "docs.google.com/document/d/1TJxAq1knHKqxefud_MbEuDEnpIJnep2ZwPn9A4A4PU4"
					},
					"\n",
					{
						"type": "link",
						"url": "https://docs.google.com/document/d/1nmjaB7WokhM2E4K62cbK6q12cf70_gOwnuBW1iK5_cE/",
						"content": "docs.google.com/document/d/1nmjaB7WokhM2E4K62cbK6q12cf70_gOwnuBW1iK5_cE"
					},
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "I've been inactive since the First Age, what did I miss?"
					},
					"\n",
					{
						"type": "link",
						"url": "https://runescape.wiki/w/Game_updates",
						"content": "runescape.wiki/w/Game_updates"
					},
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "Latest Patch Notes"
					},
					"\n",
					{
						"type": "link",
						"url": "http://services.runescape.com/m=forum/forums.ws?442,443,5,66078323",
						"content": "services.runescape.com/m=forum/forums.ws?442,443,5,66078323"
					},
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "Latest Update"
					},
					"\n",
					{
						"type": "link",
						"url": "http://services.runescape.com/m=news/month-ahead-february",
						"content": "services.runescape.com/m=news/month-ahead-february"
					},
					"\n",
					{
						"type": "link",
						"url": "http://services.runescape.com/m=news/improved-lootsharing-and-stone-spirits",
						"content": "services.runescape.com/m=news/improved-lootsharing-and-stone-spirits"
					},
					"\n",
					"\n",
					{
						"type": "inline-quote",
						"content": "RuneScape in 2019 - an introduction"
					},
					"\n",
					{
						"type": "link",
						"url": "http://services.runescape.com/m=news/an-introduction-to-2019",
						"content": "services.runescape.com/m=news/an-introduction-to-2019"
					}
				],
				{
					"type": "attachment",
					"attachmentId": 1,
					"fit": "height"
				},
				[
					{
						"type": "inline-quote",
						"content": "RuneScape Winter Reveals (RuneFest 2018)"
					}
				],
				{
					"type": "attachment",
					"attachmentId": 2,
					"fit": "height"
				}
			],
			"commentsCount": 477
		}

		expandStandaloneAttachmentLinks(post)

		expectToEqual(
			post,
			{
				"id": 243005191,
				"inReplyTo": [],
				"attachments": [
					{
						"type": "picture",
						"size": 325646,
						"picture": {
							"type": "image/png",
							"sizes": [
								{
									"width": 192,
									"height": 250,
									"url": "//i.4cdn.org/vg/1549230474936s.jpg"
								},
								{
									"width": 1000,
									"height": 1300,
									"url": "//i.4cdn.org/vg/1549230474936.png"
								}
							]
						}
					},
					{
						"id": 1,
						"type": "video",
						"video": {
							"title": "RuneScape in 2019 - an introduction",
							"description": "Grab the best-value RuneScape membership package, Premier Club, here: rs.game/PremierClubYT\n\nSo, 2019, what have you got? In this introductory video to next year, we'll be showcasing what you can expect from RuneScape in the next 3-4 months - including:\n\n- The Mining and Smithing Rework\n- Elite Dungeon 3, featuring the Ambassador\n- Comp Cape Rework\n- Player-owned Farm improvements\n- Changes to Firemaking \n- PvM Quality of Life week\n- Double XP Weekend date\n- ...and loads more!\n\nMobile Christmas update Dev Blog: https://rs.game/MobileDevBlogXmas18\n\nJoin our other communities! Join us on:\nTwitch - http://www.twitch.tv/runescape\nReddit - http://www.reddit.com/r/runescape\nTwitter - http://twitter.com/runescape\nFacebook - http://www.facebook.com/runescape\nwww.runescape.com",
							"duration": 536,
							"aspectRatio": 1.7777777777777777,
							"picture": {
								"type": "image/jpeg",
								"sizes": [
									{
										"url": "https://i.ytimg.com/vi/P8seXaqhrO8/mqdefault.jpg",
										"width": 320,
										"height": 180
									},
									{
										"url": "https://i.ytimg.com/vi/P8seXaqhrO8/maxresdefault.jpg",
										"width": 1280,
										"height": 720
									}
								]
							},
							"width": 1280,
							"height": 720,
							"source": {
								"provider": "YouTube",
								"id": "P8seXaqhrO8"
							}
						}
					},
					{
						"id": 2,
						"type": "video",
						"video": {
							"title": "RuneScape Winter Reveals (RuneFest 2018) - RS Mobile, Til Death Do Us Part, Elite dungeons & More",
							"description": "\"This is the video you've all been waiting for - the RuneScape 2018 announcements!\n\nHold on to your seats: There's an exclusive look at the special Halloween event \"\"Til Death Do Us Part\"\", the Needle Skips quest, the Alchemical Onyx items, a real Achievements Bonanza, the reveal of Elite Dungeons 3, the Mining & Smithing rework and more.... oh and we forgot, this 'tiny little thing' called RS Mobile!!\n\nThe RuneScape Mobile Android Members' Limited Beta kicks off this Monday (8th October). Are you in?\n\n\n1:45 Til' Death Do Us Part\n6:40 - The Needle Skips\n10:00 - Elite Dungeon 3 \n14:25 - Alchemical Onyx\n19:10 - Achievement Bonanza\n22:00 - Game Jam\n24:16 - Mining and Smithing Rework \n29:10 - Violet is Blue\n32:43 - RS Mobile\n\n\n\n#RuneFest2018 #RuneScape #RSMobile #EliteDungeons #MMORPG",
							"duration": 2092,
							"aspectRatio": 1.7777777777777777,
							"picture": {
								"type": "image/jpeg",
								"sizes": [
									{
										"url": "https://i.ytimg.com/vi/kYn1hnGj8oI/mqdefault.jpg",
										"width": 320,
										"height": 180
									},
									{
										"url": "https://i.ytimg.com/vi/kYn1hnGj8oI/maxresdefault.jpg",
										"width": 1280,
										"height": 720
									}
								]
							},
							"width": 1280,
							"height": 720,
							"source": {
								"provider": "YouTube",
								"id": "kYn1hnGj8oI"
							}
						}
					}
				],
				"createdAt": new Date("2019-02-03T21:47:54.000Z"),
				"subject": "/rsg/ - RuneScape General",
				"content": [
					[
						"Hold still, invader!",
						"\n",
						"\n",
						"Previous thread: ",
						{
							"type": "post-link",
							"boardId": "vg",
							"threadId": 242722274,
							"postId": 242722274,
							"content": "Сообщение",
							"url": "/vg/242722274#comment-242722274"
						},
						"\n",
						"\n",
						"Official World: 42",
						"\n",
						"Official FC: \"grindanfc\"",
						"\n",
						"Clan: GrindanScape (For an invite, go into the FC and ask for one. Requirements: 1500 total, Membership, at least one week active play)",
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "/rsg/ Guides Imgur Album"
						},
						"\n",
						{
							"type": "link",
							"url": "https://imgur.com/a/05f8m",
							"content": "imgur.com/a/05f8m"
						},
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "Beastmaster Durzag and Yakamaru indepth guide"
						},
						"\n",
						{
							"type": "link",
							"url": "https://docs.google.com/document/d/1TJxAq1knHKqxefud_MbEuDEnpIJnep2ZwPn9A4A4PU4/",
							"content": "docs.google.com/document/d/1TJxAq1knHKqxefud_MbEuDEnpIJnep2ZwPn9A4A4PU4"
						},
						"\n",
						{
							"type": "link",
							"url": "https://docs.google.com/document/d/1nmjaB7WokhM2E4K62cbK6q12cf70_gOwnuBW1iK5_cE/",
							"content": "docs.google.com/document/d/1nmjaB7WokhM2E4K62cbK6q12cf70_gOwnuBW1iK5_cE"
						},
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "I've been inactive since the First Age, what did I miss?"
						},
						"\n",
						{
							"type": "link",
							"url": "https://runescape.wiki/w/Game_updates",
							"content": "runescape.wiki/w/Game_updates"
						},
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "Latest Patch Notes"
						},
						"\n",
						{
							"type": "link",
							"url": "http://services.runescape.com/m=forum/forums.ws?442,443,5,66078323",
							"content": "services.runescape.com/m=forum/forums.ws?442,443,5,66078323"
						},
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "Latest Update"
						},
						"\n",
						{
							"type": "link",
							"url": "http://services.runescape.com/m=news/month-ahead-february",
							"content": "services.runescape.com/m=news/month-ahead-february"
						},
						"\n",
						{
							"type": "link",
							"url": "http://services.runescape.com/m=news/improved-lootsharing-and-stone-spirits",
							"content": "services.runescape.com/m=news/improved-lootsharing-and-stone-spirits"
						},
						"\n",
						"\n",
						{
							"type": "inline-quote",
							"content": "RuneScape in 2019 - an introduction"
						},
						"\n",
						{
							"type": "link",
							"url": "http://services.runescape.com/m=news/an-introduction-to-2019",
							"content": "services.runescape.com/m=news/an-introduction-to-2019"
						}
					],
					{
						"type": "attachment",
						"attachmentId": 1,
						"fit": "height"
					},
					[
						{
							"type": "inline-quote",
							"content": "RuneScape Winter Reveals (RuneFest 2018)"
						}
					],
					{
						"type": "attachment",
						"attachmentId": 2,
						"fit": "height"
					}
				],
				"commentsCount": 477
			}
		)
	})
})