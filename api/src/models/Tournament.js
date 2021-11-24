const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {

    sequelize.define('tournament', {
        state: {
            type: DataTypes.ENUM('pendiente','terminado'),
            allowNull: false,
        },
        winner: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        playerOneId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        playerTwoId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        playerThreeId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        playerFourId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        winnerOneId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        winnerTwoId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        winnerThreeId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
    });
};