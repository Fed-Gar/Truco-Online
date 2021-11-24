const { Router } = require("express");
const Sequelize = require('sequelize');
const { User } = require("../db.js");
const Op = Sequelize.Op;
const router = Router();

router.get('/', async (req, res) => {
  console.log("entro")
  try {
    const users = await User.findAll({
      order: [
        ['gamesWon', 'DESC']
      ],
      limit: 100
    });
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.sendStatus(404).send(error);
  }
});

module.exports = router;