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
 * Deletes a like from the database by id.
 *
 * @param {string} id - The id of the like to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the deletion.
 */
const deleteById = async (id) => {
  await Like.destroy({ where: { id } });
};

module.exports = { create, deleteById };
