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
  const payload = req.body;

  if (!validator.isEmail(payload.email)) {
    responseHelper.badRequest(req, res, errorMessages.INVALID_EMAIL_FORMAT, errorCodes.BAD_REQUEST);
    return;
  }

  let user = await userService.findByEmail(payload.email, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const isPasswordCorrect = await cryptoHelper.compare(payload.password, user.password);
  if (!isPasswordCorrect) {
    responseHelper.badRequest(req, res, errorMessages.CREDENTIALS_NOT_VALID, errorCodes.BAD_REQUEST);
    return;
  }

  user = _.omit(user, 'password');
  const data = cryptoHelper.generateToken(user);
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

/**
 * Handler for GET /users/{userId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const findById = async (req, res) => {
  const { userId } = req.params;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  responseHelper.ok(req, res, user);
};

/**
 * Handler for PUT /users/{userId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const update = async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const response = await userService.update(userId, payload, { returning: true, raw: true });
  responseHelper.ok(req, res, response);
};

/**
 * Handler for DELETE /users/{userId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const deleteById = async (req, res) => {
  const { userId } = req.params;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  await userService.deleteById(userId);
  responseHelper.ok(req, res);
};

/**
 * Handler for POST /users/{userId}/followers
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const followUser = async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const follower = await userService.findById(payload.followerId, { raw: true });
  if (!follower) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const data = { followedId: userId, followerId: payload.followerId };
  await userService.createFollow(data);
  responseHelper.ok(req, res);
};

/**
 * Handler for GET /users/{userId}/followers
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const listFollowers = async (req, res) => {
  const queryParams = req.query;
  const { userId } = req.params;

  const response = await userService.listFollowers(userId, queryParams);
  responseHelper.ok(req, res, response.rows, response.count);
};

/**
 * Handler for DELETE /users/{userId}/followers/{followerId}
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const unfollowUser = async (req, res) => {
  const { userId, followerId } = req.params;

  const user = await userService.findById(userId, { raw: true });
  if (!user) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  const follower = await userService.findById(followerId, { raw: true });
  if (!follower) {
    responseHelper.notFound(req, res, errorMessages.USER_NOT_FOUND, errorCodes.USER_NOT_FOUND);
    return;
  }

  await userService.unfollowUser(userId, followerId);
  responseHelper.ok(req, res);
};

module.exports = {
  create,
  login,
  findAndCountAll,
  findById,
  update,
  deleteById,
  followUser,
  listFollowers,
  unfollowUser,
};
