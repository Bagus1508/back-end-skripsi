'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userDetails.belongsTo(models.academic_reports, { foreignKey: 'user_id', as: 'academicReport' });
    }
  }
  userDetails.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    birth_place: DataTypes.STRING,
    number_id: DataTypes.STRING,
    classes: DataTypes.STRING,
    age: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    gender: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userDetails',
    tableName: 'user_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return userDetails;
};