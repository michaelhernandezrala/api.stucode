'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        field: 'id',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'title',
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'content',
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'image',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'user_id',
      },
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('articles');
  },
};
