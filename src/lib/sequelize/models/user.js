'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'biography',
      },
    },
    {
      tableName: 'users',
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
