"use strict";
exports.__esModule = true;
var express = require("express");
var http = require('http');
var appSocket = express();
var server = http.createServer(appSocket);
// const socketio = require('socket.io')
var io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
//Hacer passport
// io.use((socket, next) => {
//     console.log("socket.handshake.auth (middleware)", socket.handshake.auth)
//     if (true) {
//       next();

//     } else {
//       next(new Error("invalid"));
//     }
// });
var socketTournaments = require("./socketTournaments")(io)
var socketRooms = require("./socketRooms")(io)
var socketGameLogic = require("./socketGameLogic")(io)
var socketChatLobby = require("./socketChatLobby")(io)
require("reflect-metadata");

var cors = require("cors");
const { type } = require("os");

// import socketServer from "./socket";
// const io = socketServer(server);
appSocket.use(express.json());
appSocket.use(express.urlencoded({ extended: false }));
appSocket.use(cors());
server.listen(9000, function () {
    console.log('Server listening at port 9000.');
});

