'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Article, { foreignKey: 'articleId' });
    }
  }
  Like.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'user_id',
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Article',
          key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'article_id',
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
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'likes',
    }
  );
  return Like;
};
