const { Article } = require('../lib/sequelize/models');

/**
 * Registers a new article in the database.
 *
 * @param {object} data - The article data to be registered.
 * @param {object} [params=null] - Additional options for the creation process.
 * @returns {Promise<object>} The registered article object in plain format.
 */
const create = async (data) => {
  const response = await Article.create(data);
  return response.get({ plain: true });
};

module.exports = { create };
