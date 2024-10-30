'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        field: 'id',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password',
      },
      biography: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'biography',
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
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('users');
  },
};
