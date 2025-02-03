'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class academic_reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      academic_reports.hasOne(models.userDetails, { foreignKey: 'user_id', as: 'userDetails' });
    }
  }
  academic_reports.init({
    user_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    schedule_id: DataTypes.INTEGER,
    score: DataTypes.FLOAT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'academic_reports',
    tableName: 'academic_reports',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return academic_reports;
};