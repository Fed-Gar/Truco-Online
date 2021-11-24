const { Router, response } = require("express");
const Sequelize = require('sequelize');
const { isConstructorDeclaration } = require("typescript");
//const User = require("../models/User");
const { User, Friends, Games } = require("../db.js");
const Op = Sequelize.Op;
const router = Router();
//jwt es necesario para crear el token luego del login
const jwt = require('jsonwebtoken');
// Funcion para validar usuario
const { validarUsuario } = require('../controller/index')
const { validarAdmin } = require('../controller/validarAdmin')
const userControllers = require('../controller/users')

//Trae todos los usuarios. Se deja para el desarrollo, debería borrarse si este producto llega a abrirse al público.
router.get('/', userControllers.allUsers);

//Ruta para hacer login con usuario
router.get('/login', userControllers.userLogin)

//Ruta para hacer login con Facebook
router.get('/login/facebook', userControllers.facebookLogin)

//Ruta para obtener datos del perfil del usuario
router.get("/profile", validarUsuario, userControllers.getUserProfile);

//Ruta para traer todos los amigos de un usuario
router.get("/friends", validarUsuario, userControllers.getUserFriends);

//Ruta para crear nuevo usuario
router.post("/", userControllers.createNewUser)

//Ruta para obtener datos del perfil del usuario en ruta edit(necesito el password por eso no se reutiliza la ruta /profile)
router.get("/edit", validarUsuario, userControllers.getEditProfile);

//Ruta para modificar datos del usuario en la base de datos ---> para el caso que se quiera cambiar todos los datos
router.put('/edit', validarUsuario, userControllers.updateUser)

//Ruta para acceder a TODOS los usuarios, pasando por dos middleware de autenticación (login === true y usuario.isAdmin === true)
router.get("/users", [validarUsuario, validarAdmin], userControllers.allUsers)

//Ruta para BANEAR USUARIO, pasando por dos middleware de autenticación (login === true y usuario.isAdmin === true)
router.put("/banuser", userControllers.banUser)

//Ruta para SUSPENDER USUARIO, pasando por dos middleware de autenticación (login === true y usuario.isAdmin === true)
router.put("/suspenduser", userControllers.suspendUser)

//Ruta para RE-ACTIVAR USUARIO, pasando por dos middleware de autenticación (login === true y usuario.isAdmin === true)
router.put("/activateuser", userControllers.activateUser)






//Esta en desuso ???
router.get("/:id/history", async (req, res) => {

  //No se esta usando -----> se usa la ruta de /games/mygames

  const userId = req.params.id
  const userData = await User.findAll({
    where: {
      id: userId
    }
  });

  console.log("userData is:")
  console.log(userData)

  var username = userData[0].dataValues.username;

  Games.findAll({
    where: {
      [Op.or]: [
        { winner: username },
        { loser: username }
      ]
    }
  })
    .then(result => {
      return res.json(result)
    })
    .catch(e => res.status(404).send(e))
})

router.get("/:id/friend_requests_received", async (req, res) => {
  // const {id} = req.params;
  // const friend_requests_reveived = await User.findByPk(parseInt(id), {include: Friends, attributes:["name"], where:{status: "pending"}});
  // if(!friend_requests_reveived) res.sendStatus(404);
  // res.json(friend_requests_reveived);
  const { id } = req.params;
  var user = await User.findByPk(parseInt(id), {
    include: {
      model: User,
      as: "userRequested",
      through: {
        where: {
          status: "pending"
        }
      }
    }
  });
  var result = [...user.userRequested]

  var result2 = result.filter(f => f.Friends.status === "pending");

  res.status(200).json(result2);

});

router.get("/:id/friend_requests_sent", async (req, res) => {
  // const {id} = req.params;
  // const friend_requests_reveived = await User.findByPk(parseInt(id), {include: Friends, attributes:["name"], where:{[Op.or]: [{status: "pending"},{status: "reject"}]}});
  // if(!friend_requests_reveived) res.sendStatus(404);
  // res.json(friend_requests_reveived);
  const { id } = req.params;
  var user = await User.findByPk(parseInt(id), {
    where: {
      '$Friends.status$': { [Op.ne]: "pending" }
    },
    include: {
      model: User,
      as: "userSender",
    }
  }
  );
  var result = [...user.userSender]

  //implemento filter, porque no puedo generar la consulta con sequelize.
  var result2 = result.filter(f => f.Friends.status === "pending" || f.Friends.status === "rejected");

  res.status(200).json(result2);
})



module.exports = router;