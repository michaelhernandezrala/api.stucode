const convict = require('convict');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3610,
    env: 'PORT',
  },
  winston: {
    level: {
      doc: 'The level of the logger',
      format: '*',
      default: 'debug',
      env: 'LOG_LEVEL',
    },
  },
});

const env = config.get('env');
config.loadFile(path.join(__dirname, './' + env + '.json'));

config.validate({ allowed: 'strict' });

module.exports = config;
