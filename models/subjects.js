'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subjects.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subjects',
    tableName: 'subjects',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return subjects;
};