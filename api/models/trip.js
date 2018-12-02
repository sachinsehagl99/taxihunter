'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    bookingStatus: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    carType: DataTypes.STRING
  }, {});
  Trip.associate = function (models) {
    Trip.hasMany(models.Report, {
      foreignKey: 'tripId'
    });
    Trip.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Trip.belongsTo(models.Driver, {
      foreignKey: 'driverId'
    });
  };
  return Trip;
};