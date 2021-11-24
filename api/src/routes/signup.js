const { Router }  = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = Router();

//todas las rutas /api/signup
router.get('/' , (req , res) => {
  res.json({msg:'ruta /api/signup'});
});

router.post("/", (req, res)=>{
  const {user, email, password} = req.body;
  //hash de la password pendiente
  //logica para revisar si esta en la base de datos, si esta responde false
  if(false) return res.json({user: false, email: false}); //solo ejemplo

  //si no responde true
  res.json({user: true, email:true});
});

module.exports = router;