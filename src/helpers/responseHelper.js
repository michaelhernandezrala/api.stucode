const _ = require('lodash');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');

const errorCodes = require('../constants/errorCodes');
const logger = require('./logger');

/**
 * Generates a log object for a response.
 *
 * This function creates a log object containing details about the response,
 * including the request method, path, response time, user information, and transaction ID.
 * It is intended to standardize the structure of log entries for API responses.
 *
 * @private
 * @param {object} req - Express request object, expected to have custom properties like __startTime__,
 * __transactionId__, and _user.
 * @param {object} data - Data related to the response, such as status code and other details.
 * @returns {object} - A log object with details of the response including type, method, path, response time, user ID,
 * account ID, transaction ID, data, and message.
 */
const _generateLog = (req, data) => {
  const responseTime = new Date().getTime() - req.__startTime__;
  const transactionId = req.__transactionId__;

  return {
    type: 'RESPONSE',
    method: req.method,
    path: req.originalUrl,
    responseTime,
    userId: req._user?.id ?? undefined,
    accountId: req._user?.accountId ?? undefined,
    transactionId,
    data,
    message: `[RESPONSE] [${data?.statusCode}] ${req.route?.path}`,
  };
};

/**
 * Sends a success response with status code 200 (OK).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {object} [data=null] - Optional data to include in the response.
 * @param {number} [count=null] - Optional count value to include in the response.
 */
const ok = (req, res, data = null, count = null) => {
  const response = {
    statusCode: StatusCodes.OK,
    message: ReasonPhrases.OK,
  };

  if (!_.isNil(count)) {
    response.count = count;
  }
  if (!_.isNil(data)) {
    response.data = data;
  }

  logger.info(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a success response with status code 201 (Created).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {object} data - The data to include in the response.
 */
const created = (req, res, data) => {
  const response = {
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    data,
  };

  logger.info(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a bad request response with status code 400 (Bad Request).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.BAD_REQUEST] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.BAD_REQUEST] - Optional custom error code.
 */
const badRequest = (req, res, message = ReasonPhrases.BAD_REQUEST, errorCode = errorCodes.BAD_REQUEST) => {
  const response = {
    statusCode: StatusCodes.BAD_REQUEST,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends an unauthorized response with status code 401 (Unauthorized).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.UNAUTHORIZED] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.UNAUTHORIZED] - Optional custom error code.
 */
const unauthorized = (req, res, message = ReasonPhrases.UNAUTHORIZED, errorCode = errorCodes.UNAUTHORIZED) => {
  const response = {
    statusCode: StatusCodes.UNAUTHORIZED,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a forbidden response with status code 403 (Forbidden).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.FORBIDDEN] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.FORBIDDEN] - Optional custom error code.
 */
const forbidden = (req, res, message = ReasonPhrases.FORBIDDEN, errorCode = errorCodes.FORBIDDEN) => {
  const response = {
    statusCode: StatusCodes.FORBIDDEN,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a not found response with status code 404 (Not Found).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.NOT_FOUND] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.NOT_FOUND] - Optional custom error code.
 */
const notFound = (req, res, message = ReasonPhrases.NOT_FOUND, errorCode = errorCodes.NOT_FOUND) => {
  const response = {
    statusCode: StatusCodes.NOT_FOUND,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a conflict response with status code 409 (Conflict).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.CONFLICT] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.CONFLICT] - Optional custom error code.
 */
const conflict = (req, res, message = ReasonPhrases.CONFLICT, errorCode = errorCodes.CONFLICT) => {
  const response = {
    statusCode: StatusCodes.CONFLICT,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends an internal server error response with status code 500 (Internal Server Error).
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {string} [message=ReasonPhrases.INTERNAL_SERVER_ERROR] - Optional custom error message.
 * @param {string} [errorCode=errorCodes.ERROR] - Optional custom error code.
 */
const error = (req, res, message = ReasonPhrases.INTERNAL_SERVER_ERROR, errorCode = errorCodes.ERROR) => {
  const response = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message,
    errorCode,
  };

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

/**
 * Sends a custom response with a custom status code.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {number} statusCode - The custom status code for the response.
 * @param {string} message - The message for the response.
 * @param {string} [errorCode=null] - Optional error code for the response.
 */
const custom = (req, res, statusCode, message, errorCode = null) => {
  const response = {
    statusCode,
    message,
  };

  if (!errorCode) {
    response.errorCode = errorCode;
  }

  logger.error(_generateLog(req, response));
  res.status(response.statusCode).json(response);
};

module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound, conflict, error, custom };
