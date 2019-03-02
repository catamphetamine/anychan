import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import ignoreText from './ignoreText'
import compileFilters from './compileFilters'

function ignoreTextTest(text, expected) {
	expectToEqual(
		ignoreText(text, compileFilters({
			ignoredWords: [
				'яйц[ёа-я]{1,3}',
				'блин[ёа-я]*',
				'сковород[ёа-я]*'
			],
			ignoredWordsCaseSensitive: [
				'ЛДПР'
			]
		})),
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
					rule: '*',
					content: 'яйца'
				},
				' и запекается ',
				{
					type: 'spoiler',
					rule: '*',
					content: 'блин'
				},
				' на ',
				{
					type: 'spoiler',
					rule: '*',
					content: 'сковороде'
				},
				'.'
			]
		)
	})

	it('should replace ignored words (case-sensitive)', () => {
		ignoreTextTest(
			'Партия ЛДПР в нижнем регистре пишется: лдпр.',
			[
				'Партия ',
				{
					type: 'spoiler',
					rule: '*',
					content: 'ЛДПР'
				},
				' в нижнем регистре пишется: лдпр.'
			]
		)
	})
})