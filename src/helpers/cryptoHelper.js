const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');
const bcryptConfig = config.get('crypto.bcrypt');
const jwtConfig = config.get('crypto.jwt');

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hash = async (password) => {
  return bcrypt.hash(password, Number.parseInt(bcryptConfig.saltRound, 10));
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
const compare = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a JWT token with the given payload.
 *
 * @param {object} payload - The payload to be encoded in the token.
 * @returns {string} The generated JWT token.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

module.exports = { hash, compare, generateToken };
