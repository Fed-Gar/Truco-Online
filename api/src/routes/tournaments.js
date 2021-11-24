const { User, Tournament } = require("../db.js");
const { Router }  = require("express");
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const router = Router();

//Funcion para validar usuarios
const {validarUsuario} = require('../controller/index');

//Ruta para traer todos los torneos disputados
router.get('/' , (req , res) => {
    Tournament.findAll()
    .then(r => {
        res.json(r);
    })
});

//Ruta para agregar un torneo recién iniciado
router.post('/', validarUsuario, async (req , res) => {
    const {playerOneId, playerTwoId, playerThreeId, playerFourId, winnerOne, winnerTwo, winnerThree} = req.body;

    console.log('LISTA DE GANADORES', winnerOne, winnerTwo, winnerThree)

    if(winnerOne.length > 0 && winnerTwo.length > 0 && winnerThree.length > 0){
        const tournament = await Tournament.create({
            state: 'terminado',
            playerOneId: playerOneId,
            playerTwoId: playerTwoId,
            playerThreeId: playerThreeId,
            playerFourId: playerFourId,
            winnerOneId: winnerOne[1],
            winnerTwoId: winnerTwo[1],
            winnerThreeId: winnerThree[1],
        });
        const userWinnerOne = await User.findByPk(winnerOne[1]);
        const userWinnerTwo = await User.findByPk(winnerTwo[1]);
        const userWinnerThree = await User.findByPk(winnerThree[1]);

        const userWinnerOneUpdate = await User.update({tournamentsPlayed: ++userWinnerOne.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerOne.dataValues.tournamentsWon}, {where: {id: winnerOne[1]}});
        const userWinnerTwoUpdate = await User.update({tournamentsPlayed: ++userWinnerTwo.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerTwo.dataValues.tournamentsWon}, {where: {id: winnerTwo[1]}});
        const userWinnerThreeUpdate = await User.update({tournamentsPlayed: ++userWinnerThree.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerThree.dataValues.tournamentsWon}, {where: {id: winnerThree[1]}});

        return res.json({ message: 'Torneo finalizado y creado en la base de datos.',  });
    }
    else if(winnerOne.length > 0 && winnerTwo.length > 0){
        const tournament = await Tournament.create({
            state: 'terminado',
            playerOneId: playerOneId,
            playerTwoId: playerTwoId,
            playerThreeId: playerThreeId,
            playerFourId: playerFourId,
            winnerOneId: winnerOne[1],
            winnerTwoId: winnerTwo[1],
        });
        const userWinnerOne = await User.findByPk(winnerOne[1]);
        const userWinnerTwo = await User.findByPk(winnerTwo[1]);

        const userWinnerOneUpdate = await User.update({tournamentsPlayed: ++userWinnerOne.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerOne.dataValues.tournamentsWon}, {where: {id: winnerOne[1]}});
        const userWinnerTwoUpdate = await User.update({tournamentsPlayed: ++userWinnerTwo.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerTwo.dataValues.tournamentsWon}, {where: {id: winnerTwo[1]}});

        return res.json({ message: 'Torneo finalizado y creado en la base de datos.',  });
    }
    else if(winnerOne.length > 0){
        const tournament = await Tournament.create({
            state: 'terminado',
            playerOneId: playerOneId,
            playerTwoId: playerTwoId,
            playerThreeId: playerThreeId,
            playerFourId: playerFourId,
            winnerOneId: winnerOne[1],
        });
        const userWinnerOne = await User.findByPk(winnerOne[1]);

        const userWinnerOneUpdate = await User.update({tournamentsPlayed: ++userWinnerOne.dataValues.tournamentsPlayed, tournamentsWon: ++userWinnerOne.dataValues.tournamentsWon}, {where: {id: winnerOne[1]}});

        return res.json({ message: 'Torneo finalizado y creado en la base de datos.',  });
    }
    res.json({ message: 'Torneo finalizado y creado en la base de datos.',  });
});

router.put("/tournamentLoser/:idPlayer", validarUsuario, async (req, res)=>{
    const {idPlayer} = req.params;
    const user = await User.findByPk(idPlayer);
    const userUpdate = await User.update({tournamentsPlayed: ++user.dataValues.tournamentsPlayed, tournamentsLost: ++user.dataValues.tournamentsLost}, {where: {id: idPlayer}});
    return res.json("Información actualizada para perdedor del torneo");
});

// //Ruta para dar la partida por terminada, parte del perdedor
// router.put("/losser/:gameId/:p1Score/:p2Score", validarUsuario, async (req, res)=>{
//     const {gameId, p1Score, p2Score} = req.params;
//     const {userId} = req.body;
//     const user = await User.findByPk(parseInt(userId));
//     const game = await Games.update({state: "terminada", loser: `${user.dataValues.username}`, results: `${p1Score}|${p2Score}`}, {where: {id: gameId}});
//     const userUpdate = await User.update({gamesPlayed: ++user.dataValues.gamesPlayed, gamesLost: ++user.dataValues.gamesLost}, {where: {id: userId}});
//     return res.json("perdedor actualizado");
// });

module.exports = router;
