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

  const user = await userService.findByEmail(payload.email, { raw: true });
  if (user) {
    responseHelper.conflict(req, res, errorMessages.EMAIL_ALREADY_REGISTERED, errorCodes.CONFLICT);
    return;
  }

  payload.password = await cryptoHelper.hash(payload.password);
  let response = await userService.create(payload);
  response = _.omit(response, 'password');
  responseHelper.created(req, res, response);
};

/**
 * Handler for POST /users/login
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const login = async (req, res) => {
  let payload = req.body;

  if (!validator.isEmail(payload.email)) {
    responseHelper.badRequest(req, res, errorMessages.INVALID_EMAIL_FORMAT, errorCodes.BAD_REQUEST);
    return;
  }

  const user = await userService.findByEmail(payload.email, { raw: true });
  if (!user) {
    responseHelper.conflict(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const isPasswordCorrect = await cryptoHelper.compare(payload.password, user.password);
  if (!isPasswordCorrect) {
    responseHelper.badRequest(req, res, errorMessages.CREDENTIALS_NOT_VALID, errorCodes.BAD_REQUEST);
    return;
  }

  payload = _.omit(payload, 'password');
  const data = cryptoHelper.generateToken(payload);
  responseHelper.ok(req, res, data);
};

/**
 * Handler for GET /users
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const findAndCountAll = async (req, res) => {
  const filters = req.query;

  const response = await userService.findAndCountAll(filters, { raw: true });
  responseHelper.ok(req, res, response.rows, response.count);
};

module.exports = { create, login, findAndCountAll };
