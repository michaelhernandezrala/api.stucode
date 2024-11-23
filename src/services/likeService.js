const { Like } = require('../lib/sequelize/models');

/**
 * Creates a new like for an article by a user if it does not already exist.
 *
 * This function checks if a like record exists for the specified filters
 * (userId and articleId). If it does not exist, it creates a new like.
 * It returns the like record regardless of whether it was newly created
 * or already existed.
 *
 * @param {object} filters - The filters to find or create the like.
 * @returns {Promise<object>} The like record (with plain data) if created, or the existing like record.
 */
const create = async (filters) => {
  const [like, created] = await Like.findOrCreate({ where: filters, defaults: filters });

  return created ? like.get({ plain: true }) : like;
};

/**
 * Checks if a user has liked a specific article.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} articleId - The ID of the article.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the like exists, otherwise `false`.
 */
const checkIfLiked = async (userId, articleId) => {
  const like = await Like.findOne({ where: { userId, articleId }, raw: true });
  return !!like;
};

/**
 * Deletes a like from the database by id.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} articleId - The ID of the article.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the deletion.
 */
const deleteById = async (userId, articleId) => {
  await Like.destroy({ where: { userId, articleId } });
};

module.exports = { create, checkIfLiked, deleteById };
