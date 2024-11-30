'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Article, { foreignKey: 'userId' });
      User.hasMany(models.Like, { foreignKey: 'userId' });
      User.hasMany(models.Follower, { foreignKey: 'followedId' });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
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
