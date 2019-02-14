const configStartup = require('../../../startup/config');
const config = require('config');

describe('config file', () => {
  it('should throw error if jwtPrivateKey not defined', () => {
    config.get = function (jwtPrivateKey) {
      return jwtPrivateKey = '';
    };
    expect(() => { configStartup() }).toThrow();
  })
})