const { Router } = require("express");
const { json } = require("sequelize");
const Sequelize = require('sequelize');
const { isError } = require("util");
const Op = Sequelize.Op;
const { User, Reports } = require("../db.js");

const router = Router();

//Rutas relacionadas con reports en este archivo

router.post('/:idSender/:idReported', (req, res) => {

  var { idSender, idReported } = req.params;
  var { content } = req.body;

  if (!idSender || !idReported) return res.status(404).json({ message: "Missing parameters to report!" })
  if (!content) content = 'El usuario no dió detalles.'

  //validaciones
  //comprobando que ambos existan 

  User.findByPk(idSender, {
    include: {
      model: User,
      as: "senderUser"
    }

  })
    .then(sender => {
      if (!sender) throw new Error("No se encontro el id del usuario que reporta");
      var previousReports = sender.dataValues.senderUser;
      if (previousReports.find(u => u.id === idReported)) throw new Error("Ya se ha enviado un reporte a esta persona.")
      return User.findOne({ where: { id: idReported } })
        .then(reported => {
          if (!reported) throw new Error("No se encontro el id del usuario que está siendo reportado");
          else {
            reported.Reports = {
              content: content
            }
            sender.addSenderUser(reported, { through: { content: content } });
            return res.status(201).json({ message: "Se ha reporteado al jugador " + reported.username + "." })
          }
        }).catch(err => {
          return res.status(404).json({ message: err.message })
        })
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });

    });
})

module.exports = router;