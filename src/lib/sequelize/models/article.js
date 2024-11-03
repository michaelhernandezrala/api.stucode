'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title',
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'content',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'image',
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'user_id',
      },
    },
    {
      sequelize,
      modelName: 'Article',
      tableName: 'articles',
    }
  );
  return Article;
};
