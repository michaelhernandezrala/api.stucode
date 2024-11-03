const responseHelper = require('../helpers/responseHelper');
const articleService = require('../services/articleService');
const userService = require('../services/userService');
const likeService = require('../services/likeService');
const errorMessages = require('../constants/errorMessages');
const errorCodes = require('../constants/errorCodes');

/**
 * Handler for POST /users/{userId}/articles/{articleId}/like
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const create = async (req, res) => {
  const { userId, articleId } = req.params;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const article = await articleService.findById(articleId, { raw: true });
  if (!article) {
    responseHelper.notFound(req, res, errorMessages.ARTICLE_NOT_FOUND, errorCodes.ARTICLE_NOT_FOUND);
    return;
  }

  const filters = { userId, articleId };
  const response = await likeService.create(filters);
  responseHelper.ok(req, res, response);
};

module.exports = { create };
