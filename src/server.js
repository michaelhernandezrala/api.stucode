const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

const requestHandler = require('./middlewares/requestHandler');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./helpers/logger');

const server = express();

try {
  const apiRoute = path.join(__dirname, 'openapi', 'api.yaml');
  const apiSpec = yaml.load(fs.readFileSync(apiRoute, 'utf-8'));

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(helmet());
  server.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
  server.use(compression());
  server.use(requestHandler);

  server.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

  server.use(errorHandler);
} catch (error) {
  logger.error(`Failed to start the server: ${error.message}. Stack trace: ${error.stack}`);
}

module.exports = server;
