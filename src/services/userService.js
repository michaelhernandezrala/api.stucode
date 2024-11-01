const _ = require('lodash');
const { Op } = require('sequelize');

const { User } = require('../lib/sequelize/models');

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
  return User.findOne({ where: { id }, ...params });
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
  const offset = page * limit;
  const where = {};

  if (!_.isNil(find)) {
    where[Op.or] = [{ name: { [Op.iLike]: `%${find}%` } }, { email: { [Op.iLike]: `%${find}%` } }];
  }

  if (order === 'z-a') {
    orderClause = [['name', 'DESC']];
  }

  return User.findAndCountAll({
    where,
    order: orderClause,
    offset,
    limit,
    attributes: { exclude: ['password'] },
    ...params,
  });
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

module.exports = { create, findById, findByEmail, findAndCountAll, update };
