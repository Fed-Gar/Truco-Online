const { get } = require('http');
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('games', {
        state: {
            type: DataTypes.ENUM('pendiente','terminada'),
            allowNull: false,
        },
        winner: {
            type: DataTypes.STRING,
            defaultValue: "",
            validate: {
                validatingStatus(value){
                    if(this.state === "terminada"){
                        if(!value.length) throw new Error('Se debe ingresar un ganador');
                    }
                    if(this.state === "pendiente"){
                        if(value.length) throw new Error('Partida en curso, no se puede asignar un ganador');
                    }
                }
            }
        },
        loser: {
            type: DataTypes.STRING,
            defaultValue: "",
            validate: {
                validatingStatus(value){
                    if(this.state === "terminada"){
                        if(!value.length) throw new Error('Se debe ingresar un perdedor');
                    }
                    if(this.state === "pendiente"){
                        if(value.length) throw new Error('Partida en curso, no se puede asignar un perdedor');
                    }
                }
            }
        },
        results: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
                validatingFormat(value){
                    let regex = /^\d{0,2}\|\d{0,2}$/gm
                    //only this format is valid "12|23" un string con uno o dos numeros separados por "|"
                    if(!regex.test(value)) throw new Error("Invalid Format");
                }
            }

        },
    });
};