const configStartup = require('../../../startup/config');
const config = require('config');

describe('config file', () => {
  it('should throw error if jwtPrivateKey not defined', () => {
    config.get = function (jwtPrivateKey) {
      console.log('Fake config.get() function')
      return jwtPrivateKey = '';
    };
    expect(() => { configStartup() }).toThrow();
  })
})