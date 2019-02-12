const config = require('config');

module.exports = () => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATEL ERROR: jwtPrivateKey not defined.')
  }
}
