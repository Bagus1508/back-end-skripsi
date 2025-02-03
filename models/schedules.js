'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  schedules.init({
    schedule_date: DataTypes.DATE,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    status: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    classes_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'schedules',
    tableName: 'schedules',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return schedules;
};