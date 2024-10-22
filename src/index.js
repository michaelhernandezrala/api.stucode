const server = require('./server');

const config = require('./config');
const logger = require('./helpers/logger');

const port = config.get('port');
server.listen(port, () => {
  logger.info(`Server listening in port ${port}`);
});
