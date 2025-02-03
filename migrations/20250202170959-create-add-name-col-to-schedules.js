'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('schedules', 'name', {
      type: Sequelize.STRING,
      allowNull: true, // Sesuaikan dengan kebutuhan
      after: 'id', // Menempatkan kolom setelah 'id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedules', 'name');
  }
};
