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

module.exports = { create, findAndCountAll };