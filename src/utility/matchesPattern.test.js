import matchesPattern from './matchesPattern.js'

describe('matchesPattern', function() {
	it('should match pattern', function() {
		matchesPattern('ab', 'ab').should.equal(true)
		matchesPattern('abc', 'abc').should.equal(true)
		matchesPattern('abc', 'abcd').should.equal(false)
		matchesPattern('abcd', 'abc').should.equal(false)

		matchesPattern('ab', 'ab*').should.equal(true)
		matchesPattern('abc', 'ab*').should.equal(true)
		matchesPattern('abcd', 'ab*').should.equal(true)
		matchesPattern('abcd', 'abc*').should.equal(true)
		matchesPattern('abcd', 'abcd*').should.equal(true)
		matchesPattern('abcd', 'abcde*').should.equal(false)
	})

	it('should only allow an asterisk at the end', function() {
		expect(() => matchesPattern('abc', '*abc')).to.throw('asterisk')
		expect(() => matchesPattern('abc', 'a*bc')).to.throw('asterisk')
	})

	it('should exclude characters from asterisk matching', function() {
		matchesPattern('abcdefg/', 'abcd*').should.equal(true)
		matchesPattern('abcdefg', 'abcd*', { asteriskExcludeCharacter: '/' }).should.equal(true)
		matchesPattern('abcdefg/', 'abcd*', { asteriskExcludeCharacter: '/' }).should.equal(false)
		matchesPattern('abcdefg/hi', 'abcd*', { asteriskExcludeCharacter: '/' }).should.equal(false)

		matchesPattern('/a/', '/a/*/*', { asteriskExcludeCharacter: '/' }).should.equal(false)
		matchesPattern('/a/123', '/a/*/*', { asteriskExcludeCharacter: '/' }).should.equal(false)
		matchesPattern('/a/123/', '/a/*/*', { asteriskExcludeCharacter: '/' }).should.equal(true)
		matchesPattern('/a/123/456', '/a/*/*', { asteriskExcludeCharacter: '/' }).should.equal(true)

		matchesPattern('/a/', '/a/*/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
		matchesPattern('/a/123', '/a/*/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
		matchesPattern('/a/123/', '/a/*/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
		matchesPattern('/a/123/456', '/a/*/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(true)

		matchesPattern('/a/', '/a/*', { asteriskExcludeCharacter: '/' }).should.equal(true)
		matchesPattern('/a/123', '/a/*', { asteriskExcludeCharacter: '/' }).should.equal(true)
		matchesPattern('/a/123/', '/a/*', { asteriskExcludeCharacter: '/' }).should.equal(false)
		matchesPattern('/a/123/456', '/a/*', { asteriskExcludeCharacter: '/' }).should.equal(false)

		matchesPattern('/a/', '/a/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
		matchesPattern('/a/123', '/a/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(true)
		matchesPattern('/a/123/', '/a/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
		matchesPattern('/a/123/456', '/a/*', { asteriskExcludeCharacter: '/', asteriskOneOrMoreCharacters: true }).should.equal(false)
	})
})