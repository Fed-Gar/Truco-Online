const jwt = require('jsonwebtoken');
const { User } = require("../db.js")

exports.validarEstado = function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    console.log("Authenticated for /profile userId: ", req.body.userId)
    var inputId = req.body.userId;
    var user = User.findOne({
      where: { id: inputId }
    }).then(u => {
      console.log(u);
      if (u.status === "active") next();
      else {
        console.log("Jugadores bneados intentaron acceder al juego.")
        res.status(401).json({
          message: "No permission to access. Payer banned or suspended.", data: null
        })
      }
    }
    )

  })
}