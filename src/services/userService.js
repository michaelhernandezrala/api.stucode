const _ = require('lodash');
const { Op, Sequelize } = require('sequelize');

const { Article, User, Like } = require('../lib/sequelize/models');

/**
 * Registers a new user in the database.
 *
 * @param {object} data - The user data to be registered.
 * @param {object} [params=null] - Additional options for the creation process.
 * @returns {Promise<object>} The registered user object in plain format.
 */
const create = async (data) => {
  const response = await User.create(data);
  return response.get({ plain: true });
};

/**
 * Retrieves a user by id from the database.
 *
 * @param {string} id - The id of the user to be retrieved.
 * @param {object} [params=null] - Additional options for the query.
 * @returns {Promise<object|null>} The user object if found, or null if not.
 */
const findById = async (id, params = null) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Article,
        attributes: [],
        required: false,
      },
      {
        model: Like,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Likes"."article_id"')), 'favorites'],
        [Sequelize.fn('COUNT', Sequelize.col('Articles.id')), 'articles'],
      ],
    },
    group: ['User.id'],
    subQuery: false,
    ...params,
  });

  return {
    ...user,
    articles: parseInt(user.articles, 10) ?? 0,
    favorites: parseInt(user.favorites, 10) ?? 0,
  };
};

/**
 * Retrieves a user by email from the database.
 *
 * @param {string} email - The email of the user to be retrieved.
 * @param {object} [params=null] - Additional options for the query.
 * @returns {Promise<object|null>} The user object if found, or null if not.
 */
const findByEmail = async (email, params = null) => {
  return User.findOne({ where: { email }, ...params });
};

/**
 * Finds and counts all users based on provided filters.
 * @param {object} filters - Filters for querying users.
 * @param {object?} [params=null] - Additional parameters for the query.
 * @returns {Promise<object>} A promise that resolves to an object containing the count of users and
 * the paginated list of users.
 */
const findAndCountAll = async (filters, params = null) => {
  const { page, limit, find, order } = filters;
  let orderClause = [['name', 'ASC']];
  const offset = (page - 1) * limit;
  const where = {};

  if (find) {
    where[Op.or] = [{ name: { [Op.iLike]: `%${find}%` } }, { email: { [Op.iLike]: `%${find}%` } }];
  }

  if (order === 'z-a') {
    orderClause = [['name', 'DESC']];
  }

  const count = await User.count({ where });

  let users = await User.findAll({
    where,
    order: orderClause,
    offset,
    limit,
    include: [
      {
        model: Article,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Likes"."article_id"')), 'favorites'],
        [Sequelize.fn('COUNT', Sequelize.col('Articles.id')), 'articles'],
      ],
    },
    group: ['User.id'],
    subQuery: false,
    ...params,
  });

  if (_.isEmpty(users)) {
    return { rows: [], count: 0 };
  }

  users = users.map((user) => ({
    ...user,
    articles: parseInt(user.articles, 10) ?? 0,
    favorites: parseInt(user.favorites, 10) ?? 0,
  }));

  return { rows: users, count };
};

/**
 * Updates an existing user in the database.
 *
 * @param {string} id - The id of the user to be updated.
 * @param {object} data - The new data for the user.
 * @param {object} [params=null] - Additional options for the update process.
 * @returns {Promise<object>} The updated user object.
 */
const update = async (id, data, params = null) => {
  const response = await User.update(data, { where: { id }, ...params });
  return response[1][0];
};

/**
 * Deletes a user from the database by id.
 *
 * @param {string} id - The id of the user to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the deletion.
 */
const deleteById = async (id) => {
  await User.destroy({ where: { id } });
};

module.exports = { create, findById, findByEmail, findAndCountAll, update, deleteById };
