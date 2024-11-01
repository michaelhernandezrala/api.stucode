const convict = require('convict');
const dotenv = require('dotenv');

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
  crypto: {
    bcrypt: {
      saltRound: {
        doc: '',
        format: '*',
        default: 10,
        env: 'SALT_ROUND',
      },
    },
    jwt: {
      secret: {
        doc: '',
        format: '*',
        default: 'cZ3LmqblLxIJNYwGtOZSpuNMt2wyYgu0',
        env: 'JWT_SECRET',
      },
      expiresIn: {
        doc: '',
        format: '*',
        default: '10min',
        env: 'JWT_EXPIRES',
      },
    },
  },
  database: {
    username: {
      doc: 'Database username',
      format: String,
      default: '',
      env: 'DB_USER',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
      sensitive: true,
    },
    database: {
      doc: 'Database name',
      format: String,
      default: '',
      env: 'DB_NAME',
    },
    host: {
      doc: 'Database host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_HOST',
    },
    dialect: {
      doc: 'Database dialect (e.g., postgres, mysql)',
      format: ['postgres', 'mysql', 'sqlite', 'mariadb', 'mssql'],
      default: 'postgres',
      env: 'DB_DIALECT',
    },
  },
});

module.exports = config;
