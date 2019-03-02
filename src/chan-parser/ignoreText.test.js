import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import ignoreText from './ignoreText'

function ignoreTextTest(text, expected) {
	expectToEqual(
		ignoreText(
			text,
			[
				'яйц[ёа-я]{1,3}',
				'блин[ёа-я]*',
				'сковород[ёа-я]*'
			].map(_ => new RegExp(_))
		),
		expected
	)
}

describe('ignoreText', () => {
	it('should return the initial string when nothing is ignored', () => {
		ignoreTextTest(
			'Добавляются ингридиенты и запекается продукт на печи.',
			'Добавляются ингридиенты и запекается продукт на печи.'
		)
	})

	it('should replace ignored words (case-insensitive)', () => {
		ignoreTextTest(
			'Добавляются яйца и запекается блин на сковороде.',
			[
				'Добавляются ',
				{
					type: 'spoiler',
					censored: true,
					content: 'яйца'
				},
				' и запекается ',
				{
					type: 'spoiler',
					censored: true,
					content: 'блин'
				},
				' на ',
				{
					type: 'spoiler',
					censored: true,
					content: 'сковороде'
				},
				'.'
			]
		)
	})
})