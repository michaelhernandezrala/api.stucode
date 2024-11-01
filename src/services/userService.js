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
 * Retrieves a user by email from the database.
 *
 * @param {string} email - The email of the user to be retrieved.
 * @param {object} [params=null] - Additional options for the query.
 * @returns {Promise<object|null>} The user object if found, or null if not.
 */
const getByEmail = async (email, params = null) => {
  return User.findOne({ where: { email }, ...params });
};

module.exports = { create, getByEmail };
