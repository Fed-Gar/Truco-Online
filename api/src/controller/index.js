const jwt = require('jsonwebtoken');

exports.validarUsuario = function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({
        status: "error",
        message: err.message, data: null
      })
    } else {
      req.body.userId = decoded.id
      next()
    }
  })
}


