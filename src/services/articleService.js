const _ = require('lodash');
const { Op } = require('sequelize');

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

/**
 * Retrieves an article by id from the database.
 *
 * @param {string} id - The id of the article to be retrieved.
 * @param {object} [params=null] - Additional options for the query.
 * @returns {Promise<object|null>} The article object if found, or null if not.
 */
const findById = async (id, params = null) => {
  return Article.findOne({ where: { id }, ...params });
};

/**
 * Finds and counts all articles based on provided filters.
 * @param {object} filters - Filters for querying articles.
 * @param {object?} [params=null] - Additional parameters for the query.
 * @returns {Promise<object>} A promise that resolves to an object containing the count of articles and
 * the paginated list of articles.
 */
const findAndCountAll = async (filters, params = null) => {
  const { userId, page, limit, find, order } = filters;
  let orderClause = [['title', 'ASC']];
  const offset = page * limit;
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (!_.isNil(find)) {
    where[Op.or] = [{ title: { [Op.iLike]: `%${find}%` } }, { content: { [Op.iLike]: `%${find}%` } }];
  }

  if (order === 'z-a') {
    orderClause = [['title', 'DESC']];
  }

  return Article.findAndCountAll({
    where,
    order: orderClause,
    offset,
    limit,
    ...params,
  });
};

/**
 * Updates an existing article in the database.
 *
 * @param {object} filters - The filters of the article to be updated.
 * @param {object} data - The new data for the article.
 * @param {object} [params=null] - Additional options for the update process.
 * @returns {Promise<object>} The updated article object.
 */
const update = async (filters, data, params = null) => {
  const response = await Article.update(data, { where: { ...filters }, ...params });
  return response[1][0];
};

module.exports = { create, findById, findAndCountAll, update };
