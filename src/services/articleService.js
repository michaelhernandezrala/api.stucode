const _ = require('lodash');
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
  const offset = (page - 1) * limit;
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

  if (_.isEmpty(articles)) {
    return { rows: [], count: 0 };
  }

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
  const id = response[1][0].id;
  return findById(id, { raw: true });
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

/**
 * Finds and counts all favorite articles for a specific user based on provided filters.
 *
 * @async
 * @function findAndCountAllFavorites
 * @param {object} filters - The filtering options for retrieving favorite articles.
 * @param {object?} [params=null] - Additional parameters for the query.
 * @returns {Promise<object>} An object containing the count and rows of favorite articles.
 */
const findAndCountAllFavorites = async (filters, params = {}) => {
  const { userId, page = 1, limit = 10, find, order } = filters;

  const offset = (page - 1) * limit;
  const orderClause = order === 'desc' ? [['title', 'DESC']] : [['title', 'ASC']];

  const where = {};
  if (find) {
    where[Op.or] = [{ title: { [Op.iLike]: `%${find}%` } }, { content: { [Op.iLike]: `%${find}%` } }];
  }

  const { count, rows: articles } = await Article.findAndCountAll({
    where,
    include: [
      {
        model: Like,
        attributes: [],
        where: { userId },
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM likes AS l
            WHERE l.article_id = "Article"."id"
          )`),
          'likesCount',
        ],
      ],
    },
    order: orderClause,
    limit,
    offset,
    ...params,
  });

  const formattedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    userId: article.userId,
    likes: parseInt(article.likesCount, 10) || 0,
  }));

  return { rows: formattedArticles, count };
};

module.exports = { create, findById, findAndCountAll, update, deleteByUserIdAndArticleId, findAndCountAllFavorites };
