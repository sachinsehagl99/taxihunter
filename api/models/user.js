'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Trip, {
      foreignKey: 'userId'
    })
  };
  return User;
};