const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Friends', {
        status: {
          type: DataTypes.ENUM('pending', 'rejected', 'accepted'),
          allowNull: false,
        },
    });
}



