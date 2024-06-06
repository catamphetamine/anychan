import getInReplyToIds from './getInReplyToIds.js'

describe('dataSources/example/api/utility/getInReplyToIds', () => {
	it('should find in-reply-to comment IDs', () => {
		getInReplyToIds('>>123text\n\n\nText >>456 fasd\nWord>>789').should.deep.equal([
			123,
			456,
			789
		])
	})
})