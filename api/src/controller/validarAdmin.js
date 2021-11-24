const jwt = require('jsonwebtoken');
const { User } = require("../db.js")

exports.validarAdmin = function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    console.log("Authenticated for /profile userId: ", req.body.userId)
    var inputId = req.body.userId;
    var user = User.findOne({
      where: { id: inputId }
    }).then(u => {
      console.log(u);
      if (u.isAdmin) next();
      else {
        console.log("Se intentó acceso a PanelAdmin sin derechos de administrador.")
        res.status(401).json({
          message: "No permission to access.", data: null
        })
      }
    }
    )

  })
}