'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class answers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  answers.init({
    question_id: DataTypes.INTEGER,
    option: DataTypes.STRING,
    description: DataTypes.STRING,
    attachment: DataTypes.STRING,
    is_true_answer: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'answers',
    tableName: 'answers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return answers;
};