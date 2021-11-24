const { Router } = require("express");
const Sequelize = require('sequelize');
//const User = require("../models/User");

const { User, Friends, Games, Reports } = require("../db.js");

const Op = Sequelize.Op;

const router = Router();

// Users


const u1 = { username: "pedro", email: "pedro@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u2 = { username: "nelson", email: "nelson@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u3 = { username: "guille", email: "guille@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u4 = { username: "tomas", email: "tomas@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u5 = { username: "leo", email: "leo@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u6 = { username: "santiago", email: "santiago@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u7 = { username: "fede", email: "fede@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u8 = { username: "marcelo", email: "marcelo@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u9 = { username: "abel", email: "abel@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u10 = { username: "artemio", email: "artemio@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0, status: "baneado" }
const u11 = { username: "matias", email: "matias@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0, status: "suspendido" }
const u12 = { username: "agusto", email: "agusto@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u13 = { username: "belmiro", email: "belmiro@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u14 = { username: "angélica", email: "angelica@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u15 = { username: "daria", email: "daria@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u16 = { username: "ida", email: "ida@mail.com", password: "1234", gamesPlayed: 0, gamesWon: 0, gamesLost: 0, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u17 = { username: "yoana", email: "yoana@mail.com", password: "1234", gamesPlayed: 6, gamesWon: 5, gamesLost: 1, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u18 = { username: "colette", email: "colette@mail.com", password: "1234", gamesPlayed: 6, gamesWon: 3, gamesLost: 3, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u19 = { username: "rosa", email: "rosa@mail.com", password: "1234", gamesPlayed: 12, gamesWon: 10, gamesLost: 2, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u20 = { username: "ticiana", email: "ticiana@mail.com", password: "1234", gamesPlayed: 3, gamesWon: 1, gamesLost: 2, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u21 = { username: "vero", email: "vero@mail.com", password: "1234", gamesPlayed: 8, gamesWon: 8, gamesLost: 1, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u22 = { username: "wilma", email: "wilma@mail.com", password: "1234", gamesPlayed: 7, gamesWon: 6, gamesLost: 13, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u23 = { username: "desireé", email: "desiree@mail.com", password: "1234", gamesPlayed: 2, gamesWon: 1, gamesLost: 1, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u24 = { username: "diva", email: "diva@mail.com", password: "1234", gamesPlayed: 5, gamesWon: 1, gamesLost: 4, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }
const u25 = { username: "marcela", email: "marcela@mail.com", password: "1234", gamesPlayed: 5, gamesWon: 4, gamesLost: 1, tournamentsPlayed: 0, tournamentsWon: 0, tournamentsLost: 0 }


var users = [u9, u10, u11, u12, u13, u14, u15, u16, u17, u18, u19, u20,
  u21, u22, u23, u24, u25]



// Friends (friendships)

const f1 = { status: "pending", userSenderId: 1, userRequestedId: 7 }
const f2 = { status: "pending", userSenderId: 2, userRequestedId: 8 }
const f3 = { status: "pending", userSenderId: 3, userRequestedId: 4 }
const f4 = { status: "pending", userSenderId: 4, userRequestedId: 5 }
const f5 = { status: "pending", userSenderId: 5, userRequestedId: 6 }
const f6 = { status: "pending", userSenderId: 6, userRequestedId: 8 }
const f7 = { status: "pending", userSenderId: 1, userRequestedId: 3 }
const f8 = { status: "pending", userSenderId: 2, userRequestedId: 4 }
const f9 = { status: "accepted", userSenderId: 1, userRequestedId: 5 }
const f10 = { status: "accepted", userSenderId: 2, userRequestedId: 6 }
const f11 = { status: "accepted", userSenderId: 3, userRequestedId: 5 }
const f12 = { status: "accepted", userSenderId: 7, userRequestedId: 6 }
const f13 = { status: "accepted", userSenderId: 8, userRequestedId: 7 }
const f14 = { status: "accepted", userSenderId: 1, userRequestedId: 8 }
const f15 = { status: "accepted", userSenderId: 2, userRequestedId: 3 }

const r1 = { content: "Jugador que insulta", senderUserId: 1, reportedUserId: 3 }
const r2 = { content: "Jugador que insulta", senderUserId: 1, reportedUserId: 5 }
const r3 = { content: "Jugador que insulta", senderUserId: 1, reportedUserId: 9 }
const r4 = { content: "Jugador que insulta", senderUserId: 2, reportedUserId: 1 }
const r5 = { content: "Jugador que insulta", senderUserId: 6, reportedUserId: 1 }
const r6 = { content: "Jugador que insulta", senderUserId: 8, reportedUserId: 1 }
const r7 = { content: "Jugador que insulta", senderUserId: 2, reportedUserId: 3 }
const r8 = { content: "Jugador que insulta", senderUserId: 12, reportedUserId: 3 }
const r9 = { content: "Jugador que insulta", senderUserId: 10, reportedUserId: 6 }

var friendships = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14];

var reports = [r1, r2, r3, r4, r5, r6, r7, r8, r9];

// Games


router.post("/", async (req, res) => {

  try {
    await Games.create({
      state: "pendiente",
      winner: "",
      loser: "",
      results: "12|23"
    })

    await Games.create({
      state: "pendiente",
      winner: "",
      loser: "",
      results: "11|13"
    })

    await Games.create({
      state: "terminada",
      winner: "pedro",
      loser: "leo",
      results: "11|13"
    })

    await Games.create({
      state: "terminada",
      winner: "pedro",
      loser: "santiago",
      results: "11|13"
    })


    var d1 = await User.create(u1)
    var d2 = await User.create(u2)
    var d3 = await User.create(u3)
    var d4 = await User.create(u4)
    var d5 = await User.create(u5)
    var d6 = await User.create(u6)
    var d7 = await User.create(u7)
    var d8 = await User.create(u8)

    d1.isAdmin = true;
    d2.isAdmin = true;
    d3.isAdmin = true;
    d4.isAdmin = true;
    d5.isAdmin = true;
    d6.isAdmin = true;
    d7.isAdmin = true;

    await d1.save();
    await d2.save();
    await d3.save();
    await d4.save();
    await d5.save();
    await d6.save();
    await d7.save();

    for await (u of users) {
      User.create(u)
    }


    await Friends.create(f15)

    for await (f of friendships) {
      Friends.create(f)
    }

    for await (r of reports) {
      Reports.create(r)
    }

    res.status(200).json({ message: "Tabla de prueba llenada con éxito." });
  }


  catch (err) {
    res.json({ message: err.message })
  }


})



module.exports = router;