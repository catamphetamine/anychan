import getContentForText from './getContentForText.js'

describe('dataSources/example/api/utility/getContentForText', () => {
	it('should split by new line character', () => {
		getContentForText('Abc\nDef').should.deep.equal([
			[
				'Abc',
				'\n',
				'Def'
			]
		])
	})

	it('should split into paragraphs', () => {
		getContentForText('Abc\n\n\nDef').should.deep.equal([
			[
				'Abc'
			],
			[
				'Def'
			]
		])
	})
})