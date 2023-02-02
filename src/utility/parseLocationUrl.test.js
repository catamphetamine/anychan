import parseLocationUrl from './parseLocationUrl.js';

describe('parseLocationUrl', () => {
  it('should convert a URL to a location object', () => {
    parseLocationUrl('https://example.com/error?a=b#c').should.deep.equal({
      origin: 'https://example.com',
      pathname: '/error',
      search: '?a=b',
      hash: '#c'
    });
  });

  it('should convert a URL to a location object (only has the domain part)', () => {
    parseLocationUrl('https://example.com').should.deep.equal({
      origin: 'https://example.com',
      pathname: '/',
      search: '',
      hash: ''
    });
  });
});
