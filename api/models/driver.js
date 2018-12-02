'use strict';
module.exports = (sequelize, DataTypes) => {
  var Driver = sequelize.define('Driver', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    carType: DataTypes.STRING,
    carModel: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Driver.associate = function (models) {
    Driver.hasMany(models.Trip, {
      foreignKey: 'driverId'
    })
  };
  return Driver;
};