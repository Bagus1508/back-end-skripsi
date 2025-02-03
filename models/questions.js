'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      questions.belongsTo(models.schedules, { foreignKey: 'schedule_id', as: 'schedule_detail' });
    }
  }
  questions.init({
    schedule_id: DataTypes.INTEGER,
    question: DataTypes.TEXT,
    attachment: DataTypes.STRING,
    grade: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'questions',
    tableName: 'questions',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return questions;
};