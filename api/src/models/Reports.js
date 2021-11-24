const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Reports', {
    content: {
      type: DataTypes.STRING,
    },
  });
}