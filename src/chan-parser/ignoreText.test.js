import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import ignoreText from './ignoreText'
import compileFilters from './compileFilters'

function ignoreTextTest(text, expected) {
	expectToEqual(
		ignoreText(
			text,
			compileFilters(
				[
					'яйц.{1,3}',
					'блин.*',
					'^конструкци.*',
					'.*черепица$',
					'сковород.*'
				],
				'ru'
			)
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

	it('should handle ^-rules at the start of a word', () => {
		ignoreTextTest(
			'Металлоконструкция',
			'Металлоконструкция'
		)
		ignoreTextTest(
			'Конструкция',
			[{
				type: 'spoiler',
				censored: true,
				content: 'Конструкция'
			}]
		)
	})

	it('should handle $-rules at the end of a word', () => {
		ignoreTextTest(
			'Металлочерепицами',
			'Металлочерепицами'
		)
		ignoreTextTest(
			'Металлочерепица',
			[{
				type: 'spoiler',
				censored: true,
				content: 'Металлочерепица'
			}]
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