'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class non_academic_reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  non_academic_reports.init({
    user_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    schedule_id: DataTypes.INTEGER,
    score: DataTypes.FLOAT,
    achievement: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'non_academic_reports',
    tableName: 'non_academic_reports',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return non_academic_reports;
};