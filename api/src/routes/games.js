const { User, Friends, Games } = require("../db.js");
const { Router }  = require("express");
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const router = Router();

//Funcion para validar usuarios
const {validarUsuario} = require('../controller/index')

//Ruta para traer todos los juegos disputados
router.get('/' , (req , res) => {
    Games.findAll()
    .then(r => {
        res.json(r);
    })
})

//Agregar validacion
//Ruta para agregar una partida nueva que recien inicia a la base de datos
router.post('/', validarUsuario, async (req , res) => {
    const {userId} = req.body;
    const game = await Games.create({
        state: "pendiente",
        winner: "",
        loser: "",
        results: "0|0"
      });
    await game.addUser(userId);
    return res.json(game.id);
});

//Ruta para vincular tambien al otro jugador a la partida
router.patch('/:gameId', validarUsuario, async (req , res) => {
    const {userId} = req.body;
    const {gameId} = req.params;
    const game= await Games.findByPk(parseInt(gameId));
    if(game){
        await game.addUser(userId);
        return res.json("se creo");
    }
    res.sendStatus(404);
    
});

//Ruta para modificar puntaje partida
router.put("/:gameId/:p1Score/:p2Score", async(req, res)=>{
    const {gameId, p1Score, p2Score} = req.params;
    const game = await Games.update({results: `${p1Score}|${p2Score}`}, {where: {id: gameId}});
    if(game) return res.json("modificado");
    res.sendStatus(404);
});

//Ruta para dar la partida por terminada, parte del perdedor
router.put("/losser/:gameId/:p1Score/:p2Score", validarUsuario, async (req, res)=>{
    const {gameId, p1Score, p2Score} = req.params;
    const {userId} = req.body;
    const user = await User.findByPk(parseInt(userId));
    const game = await Games.update({state: "terminada", loser: `${user.dataValues.username}`, results: `${p1Score}|${p2Score}`}, {where: {id: gameId}});
    const userUpdate = await User.update({gamesPlayed: ++user.dataValues.gamesPlayed, gamesLost: ++user.dataValues.gamesLost}, {where: {id: userId}});
    return res.json("perdedor actualizado");
});

//Ruta para dar la partida por terminada,parte del ganador, si es diferente a la del perdedor por ahora la partida se elimina de la base de datos
router.put("/winner/:gameId/:p1Score/:p2Score", validarUsuario, async (req, res)=>{
    const {gameId, p1Score, p2Score} = req.params;
    const {userId} = req.body;
    const user = await User.findByPk(parseInt(userId));
    const checkIntegrity = await Games.findByPk(parseInt(gameId));
    if(checkIntegrity.dataValues.results === `${p1Score}|${p2Score}` && checkIntegrity.dataValues.state === "terminada" && checkIntegrity.dataValues.loser !== ""){
        await Games.update({winner: `${user.username}`}, {where: {id: gameId}})
        const userUpdate = await User.update({gamesPlayed: ++user.dataValues.gamesPlayed, gamesWon: ++user.dataValues.gamesWon}, {where: {id: userId}});
        return res.json("partida finalizada");
    }
    Games.destroy({where: {id: gameId}})
    return res.json("El perdedor y al ganador tienen datos diferentes");
});


//ruta solo para hacer testing [CUIDADO CON LA RUTA, HAY CONFLICTO CON OTRAS RUTA ---> EJ /mygames]
// router.get('/:id', async (req , res) => {
//     const {id} = req.params;
//     const user = await User.findOne({ 
//         where: { id: id}, include: Games,
//        })
//     return res.json(user)
// });

//Ruta para modificar una partida [TERMINADA] a un usuario /:idUsuarioLoegado/:idDeLaPartida
router.post('/:userid/:gameid' , (req , res) => {
    const {userid, gameid} = req.params

    let gamesData = null
    let userData = null

    Games.findOne({
        where: {id: gameid},
        raw: true
    })
    .then((gameFound) => {
        if(!gameFound) throw new Error("No existe la partida")
        if(gameFound.state === 'pendiente') throw new Error("La partida aun se encuentra pendiente")
        
        gamesData = gameFound
        return User.findOne({ 
            where: { id: userid},
        })
    })
    .then(user => {
        if(!user) throw new Error("No existe el usuario")
        userData = user.toJSON()

        if(gamesData.winner !== userData.username && gamesData.loser !== userData.username) throw new Error("El usuario no participo de la partida")

        return user.getGames({
            where: {id: gameid},
        })
    })
    .then(hasResult => {
        if(hasResult.length){
            throw new Error("El usuario ya tiene asignada esta partida")  
        } 
        return User.findOne({ 
            where: { id: userid},
        })
    })
    .then(user => {
        return user.addGames(gameid)
    })
    .then(response => {
        res.json(response)
    })
    .catch((err) => {
        return res.json({message: err.message})
    })
})

//Ruta para ver todas las partidas en las que participo el usuario logeado
//Middleware validarUsuario ----> se necesita el token
router.get('/mygames', validarUsuario, (req , res) => {

    const userid = req.body.userId
    let userData = null
    let userGamesData = null

    User.findOne({ 
        where: { id: userid},
        attributes: ['id', 'username'],
    })
    .then(user => {
        userData = user.toJSON()
        return user.getGames({
            attributes: ['id','state', "winner", "loser", "createdAt"]
        })
    })
    .then(result => {
        userGamesData = result.map(r => r.toJSON())
        userGamesData = userGamesData.map(d => {
            return {
                id: d.id,
                state: d.state,
                createdAt: d.createdAt,
                winner: d.winner,
                loser: d.loser
            }
        })
        const ans = {
            id: userData.id,
            username: userData.username,
            games: userGamesData
        }

        res.json(ans)
    })
    .catch((err) => {
        return res.json({message: err.message})
    })
})

//Ruta para ver todas las partidas en las que participo el otro usuario
router.get('/games/:id', validarUsuario, (req , res) => {
    
    const userid = req.params.id
    let userData = null
    let userGamesData = null

    User.findOne({ 
        where: { id: userid},
        attributes: ['id', 'username'],
    })
    .then(user => {
        userData = user.toJSON()
        return user.getGames({
            attributes: ['id','state', "winner", "loser", "createdAt"]
        })
    })
    .then(result => {
        userGamesData = result.map(r => r.toJSON())
        userGamesData = userGamesData.map(d => {
            return {
                id: d.id,
                state: d.state,
                createdAt: d.createdAt,
                winner: d.winner,
                loser: d.loser
            }
        })
        const ans = {
            id: userData.id,
            username: userData.username,
            games: userGamesData
        }

        res.json(ans)
    })
    .catch((err) => {
        return res.json({message: err.message})
    })
    
})


module.exports = router;
