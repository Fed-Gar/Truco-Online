const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {

    sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            //Se desactiva el allownull para aquellos usuarios que ingresan con facebook, no se les requeire contraseña
            // allowNull: false,
        },
        gamesPlayed: {
            type: DataTypes.INTEGER,
        },
        gamesWon: {
            type: DataTypes.INTEGER,
        },
        gamesLost: {
            type: DataTypes.INTEGER,
        },
        tournamentsPlayed: {
            type: DataTypes.INTEGER,
        },
        tournamentsWon: {
            type: DataTypes.INTEGER,
        },
        tournamentsLost: {
            type: DataTypes.INTEGER,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        image: {
            type: DataTypes.STRING,
            defaultValue: "/static/media/profileIcon.ab9b9b6d.png"
        },
        status: { // Para indicar si está "activ", "baneado" o "suspendido"
            type: DataTypes.STRING,
            defaultValue: "activo"
        }

    });
};