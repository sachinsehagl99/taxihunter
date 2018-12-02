'use strict';
module.exports = (sequelize, DataTypes) => {
  var Report = sequelize.define('Report', {
    report: DataTypes.STRING
  }, {});
  Report.associate = function (models) {
    Report.belongsTo(models.Trip, {
      foreignKey: 'tripId'
    })
  };
  return Report;
};