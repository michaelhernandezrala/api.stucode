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

module.exports = { create, findAndCountAll };