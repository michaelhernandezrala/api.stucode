const config = require('../../config');

module.exports = {
  development: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    host: config.get('database.host'),
    dialect: config.get('database.dialect'),
    logging: false,
  },
  test: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    host: config.get('database.host'),
    dialect: config.get('database.dialect'),
    logging: false,
  },
  production: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    host: config.get('database.host'),
    dialect: config.get('database.dialect'),
    logging: false,
  },
};
