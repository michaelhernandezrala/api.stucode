const bcrypt = require('bcrypt');

const config = require('../config');
const bcryptConfig = config.get('crypto.bcrypt');

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hash = async (password) => {
  return bcrypt.hash(password, Number.parseInt(bcryptConfig.saltRound, 10));
};

module.exports = { hash };
