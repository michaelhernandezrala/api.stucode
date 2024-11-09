const { Op, Sequelize } = require('sequelize');

const { Article, Like } = require('../lib/sequelize/models');

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
  const article = await Article.findOne({
    where: { id },
    include: [
      {
        model: Like,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likes']],
    },
    group: ['Article.id'],
    subQuery: false,
    ...params,
  });

  return {
    ...article,
    likes: parseInt(article.likes, 10) ?? 0,
  };
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

  if (find) {
    where[Op.or] = [{ title: { [Op.iLike]: `%${find}%` } }, { content: { [Op.iLike]: `%${find}%` } }];
  }

  if (order === 'z-a') {
    orderClause = [['title', 'DESC']];
  }

  const count = await Article.count({ where });

  let articles = await Article.findAll({
    where,
    order: orderClause,
    offset,
    limit,
    include: [
      {
        model: Like,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likes']],
    },
    group: ['Article.id'],
    subQuery: false,
    ...params,
  });

  articles = articles.map((article) => ({
    ...article,
    likes: parseInt(article.likes, 10) ?? 0,
  }));

  return { rows: articles, count };
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

/**
 * Deletes a user from the database by its user owner and id.
 *
 * @param {object} filters - The filters of the article to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the deletion.
 */
const deleteByUserIdAndArticleId = async (filters) => {
  await Article.destroy({ where: { ...filters } });
};

module.exports = { create, findById, findAndCountAll, update, deleteByUserIdAndArticleId };
