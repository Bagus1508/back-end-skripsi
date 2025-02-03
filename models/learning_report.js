'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class learning_report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  learning_report.init({
    user_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    schedule_id: DataTypes.INTEGER,
    test_scores: DataTypes.FLOAT,
    total_scores: DataTypes.FLOAT,
    is_semester: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'learning_report',
    tableName: 'learning_report',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return learning_report;
};