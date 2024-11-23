const responseHelper = require('../helpers/responseHelper');
const articleService = require('../services/articleService');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const errorCodes = require('../constants/errorCodes');

/**
 * Handler for POST /users/{userId}/articles
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const create = async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const data = { userId, ...payload };
  const response = await articleService.create(data);
  responseHelper.created(req, res, response);
};

/**
 * Handler for GET /users/articles
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const findAndCountAll = async (req, res) => {
  const filters = req.query;

  const response = await articleService.findAndCountAll(filters, { raw: true });
  responseHelper.ok(req, res, response.rows, response.count);
};

/**
 * Handler for GET /users/{userId}/articles/{articleId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const findByUserIdAndArticleId = async (req, res) => {
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

  responseHelper.ok(req, res, article);
};

/**
 * Handler for PUT /users/{userId}/articles/{articleId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const updateByUserIdAndArticleId = async (req, res) => {
  const { userId, articleId } = req.params;
  const payload = req.body;

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

  const filters = { userId, id: articleId };
  const response = await articleService.update(filters, payload, { returning: true, raw: true });
  responseHelper.ok(req, res, response);
};

/**
 * Handler for DELETE /users/{userId}/articles/{articleId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const deleteByUserIdAndArticleId = async (req, res) => {
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

  const filters = { userId, id: articleId };
  await articleService.deleteByUserIdAndArticleId(filters);
  responseHelper.ok(req, res);
};

/**
 * Handler for DELETE /users/{userId}/favorites
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const findFavoritesByUserId = async (req, res) => {
  const { userId } = req.params;
  const queryParams = req.query;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const filters = { userId, ...queryParams };
  const response = await articleService.findAndCountAllFavorites(filters, { raw: true });
  responseHelper.ok(req, res, response.rows, response.count);
};

module.exports = {
  create,
  findAndCountAll,
  findByUserIdAndArticleId,
  updateByUserIdAndArticleId,
  deleteByUserIdAndArticleId,
  findFavoritesByUserId,
};
