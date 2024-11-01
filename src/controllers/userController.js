const _ = require('lodash');
const validator = require('validator');

const cryptoHelper = require('../helpers/cryptoHelper');
const responseHelper = require('../helpers/responseHelper');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const errorCodes = require('../constants/errorCodes');

/**
 * Handler for POST /users/register
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const create = async (req, res) => {
  const payload = req.body;

  if (!validator.isEmail(payload.email)) {
    responseHelper.badRequest(req, res, errorMessages.INVALID_EMAIL_FORMAT, errorCodes.BAD_REQUEST);
    return;
  }

  const user = await userService.getByEmail(payload.email, { raw: true });
  if (user) {
    responseHelper.conflict(req, res, errorMessages.EMAIL_ALREADY_REGISTERED, errorCodes.CONFLICT);
    return;
  }

  payload.password = await cryptoHelper.hash(payload.password);
  let response = await userService.create(payload);
  response = _.omit(response, 'password');
  responseHelper.created(req, res, response);
};

module.exports = { create };
