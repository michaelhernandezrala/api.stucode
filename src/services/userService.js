const _ = require('lodash');
const { Op, Sequelize } = require('sequelize');

const { Article, User, Like, Follower } = require('../lib/sequelize/models');

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
      {
        model: Follower,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Likes"."article_id"')), 'favorites'],
        [Sequelize.fn('COUNT', Sequelize.col('Articles.id')), 'articles'],
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Followers"."followed_id"')), 'followers'],
      ],
    },
    group: ['User.id'],
    subQuery: false,
    ...params,
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    articles: parseInt(user.articles, 10) ?? 0,
    favorites: parseInt(user.favorites, 10) ?? 0,
    followers: parseInt(user.followers, 10) ?? 0,
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
      {
        model: Like,
        attributes: [],
        required: false,
      },
      {
        model: Follower,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Likes"."article_id"')), 'favorites'],
        [Sequelize.fn('COUNT', Sequelize.col('Articles.id')), 'articles'],
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Followers"."followed_id"')), 'followers'],
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
    followers: parseInt(user.followers, 10) ?? 0,
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

/**
 * Creates a follow relationship between two users.
 *
 * @param {object} data - The data containing `followerId` and `followedId`.
 * @returns {Promise<void>} Resolves when the follow relationship is successfully created.
 */
const createFollow = async (data) => {
  await Follower.create(data);
};

/**
 * Retrieves a paginated list of followers for a user based on filters.
 *
 * @param {string} userId - The ID of the user whose followers are being retrieved.
 * @param {object} filters - Filters for querying followers.
 * @returns {Promise<object>} A promise that resolves to an object containing the count of followers and the paginated list of followers.
 */
const listFollowers = async (userId, filters) => {
  const { page, limit, find, order } = filters;
  let orderClause = [[{ model: User, as: 'follower' }, 'name', 'ASC']];
  const offset = (page - 1) * limit;
  const where = {};

  if (find) {
    where[Op.or] = [
      { 'follower.name': { [Op.iLike]: `%${find}%` } },
      { 'follower.email': { [Op.iLike]: `%${find}%` } },
    ];
  }

  if (order === 'z-a') {
    orderClause = [[{ model: User, as: 'follower' }, 'name', 'DESC']];
  }

  const { count, rows } = await Follower.findAndCountAll({
    where: { followedId: userId },
    include: [
      {
        model: User,
        as: 'follower',
        where,
        attributes: { exclude: ['password'] },
      },
    ],
    order: orderClause,
    offset,
    limit,
    raw: true,
    nest: true,
  });

  const users = rows.map((row) => row.follower) ?? [];
  return { count, rows: users };
};

/**
 * Removes a follow relationship between two users.
 *
 * @param {string} followedId - The ID of the user being unfollowed.
 * @param {string} followerId - The ID of the user who wants to unfollow.
 * @returns {Promise<void>} A promise that resolves when the follow relationship is successfully removed.
 */
const unfollowUser = async (followedId, followerId) => {
  await Follower.destroy({ where: { followedId, followerId } });
};

module.exports = {
  create,
  findById,
  findByEmail,
  findAndCountAll,
  update,
  deleteById,
  createFollow,
  listFollowers,
  unfollowUser,
};
