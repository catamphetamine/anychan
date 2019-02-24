import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import parseServiceLink from './parseServiceLink'

describe('parseServiceLink', () => {
	it('should parse popular service links', () => {
		expectToEqual(
			parseServiceLink('https://discord.gg/2HPKEW'),
			{
				service: 'discord',
				text: '2HPKEW'
			}
		)

		expectToEqual(
			parseServiceLink('https://instagram.com/modoku._/'),
			{
				service: 'instagram',
				text: 'modoku._'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/profile.php?id=100006433235253'),
			{
				service: 'facebook',
				text: '100006433235253'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/durov'),
			{
				service: 'facebook',
				text: 'durov'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/people/Lada-Murasheva/100008147402555'),
			{
				service: 'facebook',
				text: 'Lada-Murasheva'
			}
		)

		expectToEqual(
			parseServiceLink('https://vk.com/name'),
			{
				service: 'vk',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('https://vk.com/id12345'),
			{
				service: 'vk',
				text: '12345'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/watch?v=0P8b81M9OWw'),
			{
				service: 'youtube',
				text: '0P8b81M9OWw'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/user/ChristopherOdd'),
			{
				service: 'youtube',
				text: 'ChristopherOdd'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/channel/UCTyA1ortyWPc1uLF5cbzluA/videos'),
			{
				service: 'youtube',
				text: 'UCTyA1ortyWPc1uLF5cbzluA'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/user/ChristopherOdd/videos'),
			{
				service: 'youtube',
				text: 'ChristopherOdd'
			}
		)

		expectToEqual(
			parseServiceLink('http://youtu.be/My2FRPA3Gf8'),
			{
				service: 'youtube',
				text: 'My2FRPA3Gf8'
			}
		)

		expectToEqual(
			parseServiceLink('https://m.youtube.com/watch?v=yModCU1OVHY'),
			{
				service: 'youtube',
				text: 'yModCU1OVHY'
			}
		)

		expectToEqual(
			parseServiceLink('http://vimeo.com/name'),
			{
				service: 'vimeo',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://vimeo.com/25451551'),
			{
				service: 'vimeo',
				text: '25451551'
			}
		)

		expectToEqual(
			parseServiceLink('https://twitter.com/name'),
			{
				service: 'twitter',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('https://twitter.com/name/status/1234567890000000000'),
			{
				service: 'twitter',
				text: 'name/1234567890000000000'
			}
		)

		expectToEqual(
			parseServiceLink('https://t.me/joinchat/B9VagUi23u76uoO2SBFGWw'),
			{
				service: 'telegram',
				text: 'B9VagUi23u76uoO2SBFGWw'
			}
		)

		expectToEqual(
			parseServiceLink('https://teleg.run/dvachannel'),
			{
				service: 'telegram',
				text: 'dvachannel'
			}
		)

		expectToEqual(
			parseServiceLink('https://t.me/name'),
			{
				service: 'telegram',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://archivach.org/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.cf/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.ng/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.ng/?tags=3420'),
			{
				service: 'arhivach',
				text: '3420'
			}
		)

		expectToEqual(
			parseServiceLink('http://github.com/name/'),
			{
				service: 'github',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://github.com/name/repo'),
			{
				service: 'github',
				text: 'name/repo'
			}
		)

		expectToEqual(
			parseServiceLink('https://2ch.hk/b/'),
			{
				service: '2ch',
				text: '/b/'
			}
		)

		expectToEqual(
			parseServiceLink('https://2ch.hk/v/res/3541116.html'),
			{
				service: '2ch',
				text: '/v/3541116'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4chan.org/f/'),
			{
				service: '4chan',
				text: '/f/'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4channel.org/a/thread/184737891#q184737891'),
			{
				service: '4chan',
				text: '/a/184737891'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4chan.org/a/thread/184737891#q184737891'),
			{
				service: '4chan',
				text: '/a/184737891'
			}
		)
	})
})