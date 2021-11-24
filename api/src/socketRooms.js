const axios = require("axios");
var activeRooms = []
const {table, buildDeck, shuffleDeck, getHands} = require("./socketGameLogicConst")

let games = {};
exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        socket.on('connected', function (name) {
            // socket.broadcast.emit('messages', { name: name, msg: name + " has joined." });
        });
        let algo = socket.handshake.auth.isInRoom
        console.log(algo)
        // socket.on("log", ()=> io.to(socket.id).emit("log"))
        socket.on('message', function (data, isAuth) {
            if(isAuth) {
                console.log('DATA:', data)
                io.to(data.roomId).emit('messages', { msg: `${data.name}: ${data.msg}` });
            }
            else io.to(socket.id).emit('messages', { msg: `No estas registrado no puedes enviar mensajes` });
            
        });
        socket.on('disconnect', function (reason) {
            io.emit('messages', { server: 'Server', message: 'Has left the room.' });
            // const clients = io.sockets?.adapter.rooms
            // notifyFriendOfDisconnect(socket)
        });

        socket.on("invite to game", (roomId, idReceiver, nameSender)=>{
            activeRooms = activeRooms.filter((room)=> room!= roomId)
            console.log(socket.id, "invitacion")
            socket.broadcast.emit("invite to game",roomId, idReceiver, nameSender);
        });
      
    
        //evento por si alguien crea una sala o entra a una
        socket.on('joinRoom', async function (roomId, name, token, password, isInv) {
            socket.leave(1);
            console.log('user:', socket.handshake.auth.user);
            const clients = io.sockets?.adapter.rooms.get(roomId) //set de clientes en room
            if(clients?.size < 2 || clients === undefined){ //revisar si la sala esta llena, para evitar que se unan mas, modificar el 2 con variable par ampliar luego a mas jugadores
            socket.join(parseInt(roomId));
            
            if(!table.games[roomId]){
                table.games[roomId]={};
                table.games[roomId].playerOne = {
                id: 1,
                name: name || "jugador 1",
                nameRival: "player2",
                score: 0,
                scoreRival: 0,
                hand: [],
                turnNumber: 1,
                isTurn: true,
                betOptions: [],
                tableRival: [],
                tablePlayer: [],
                bet: false,
                roundResults: [],
                starts: true,
                token: token,
                };
                let matchNumber = await axios.post(`http://localhost:3001/api/games`,{},{
                headers: {
                    "x-access-token": token || 1,
                }});
                table.games[roomId].common ={
                    envidoList: [],
                    envidoBet: 0,
                    trucoBet: 1,
                    scoreToWin: 30,
                    matchesToWin: 1, 
                    flor: true,
                    cumulativeScore: 1,
                    time: 15 * 1000,
                    numberPlayers: 2,
                    roundResults: [],
                    turn: 1,
                    gameId: matchNumber.data,
                    playerOneHand: [],
                    playerTwoHand: [],
                }
                io.to(roomId).emit('messages', { msg: `Esperando que se una otro jugador...` });
            }
            else{
                table.games[roomId].playerTwo = {
                    id: 2,
                    name: name || "jugador 2",
                    nameRival: "player2",
                    score: 0,
                    scoreRival: 0,
                    hand: [],
                    turnNumber: 1,
                    isTurn: false,
                    betOptions: [],
                    tableRival: [],
                    tablePlayer: [],
                    bet: false,
                    roundResults: [],
                    starts: false,
                    token: token,
                    }
                await axios.patch(`http://localhost:3001/api/games/${table.games[roomId].common.gameId}`,{},{
                    headers: {
                        "x-access-token": token || 1,
                    }});
                io.to(roomId).emit('messages', { msg: `Se ha unido ${name || "invitado"}, empieza la partida!` });
            }
            let findedRoom = activeRooms.findIndex(function (room) {
                return room.id === roomId;
            });

            if(findedRoom === -1 && password) {
                activeRooms = [...activeRooms, {id: roomId, host: name, password}]
            }
            else if(findedRoom === -1 && !password && !isInv) {
                activeRooms = [...activeRooms, {id: roomId, host: name}]
            } 
            // if(activeRooms.indexOf(roomId) === -1) activeRooms = [...activeRooms, roomId] 
            else console.log(roomId, 'ya existe');
            console.log("active rooms: ", activeRooms)
            }
            if(clients?.size === 2) { //si la sala esta llena, empieza toda la preparacion de la partida
                activeRooms = activeRooms.filter(room => room.id!== roomId)
                socket.emit("roomFull", false);
                let iterator = clients.values();
                const player1 = iterator.next().value;
                const player2 = iterator.next().value;
                console.log('clients', clients.values())
                table.games[roomId].playerOne.id = player1;
                table.games[roomId].playerTwo.id = player2;
                table.games[roomId].playerOne.nameRival = table.games[roomId].playerTwo.name;
                table.games[roomId].playerTwo.nameRival = table.games[roomId].playerOne.name;
                //dejar listo la propiedad con el id de la sala que contendra todo lo que ocurra en esta mientras dure la partida
    
                let deck = buildDeck(); //construye deck
                deck = shuffleDeck(deck); //baraja deck
                const [playerAhand, playerBhand] = getHands(deck); //obtiene manos de 3 cartas de dos jugadores
    
                //manos iniciales al iniciar partida
                table.games[roomId].playerOne.hand = playerAhand;
                table.games[roomId].playerTwo.hand = playerBhand;

                //manos copias al iniciar partida
                table.games[roomId].common.playerOneHand = [...playerAhand];
                table.games[roomId].common.playerTwoHand = [...playerBhand];
    
                //dejar las apuestas al comienzo
                table.games[roomId].playerOne.betOptions = table.betsList.firstTurn;
                table.games[roomId].playerTwo.betOptions = table.betsList.firstTurn;
    
                //emitir como deberia ser el jugador de cada cliente
                io.to(player1).emit("gameStarts", table.games[roomId].playerOne);
                io.to(player2).emit("gameStarts", table.games[roomId].playerTwo);
    
             } //remover la sala de la lista si esta llena
             io.emit("newRoomCreated"); // informar a todos los clientes lista neuvas creadas o cerradas
        });
        socket.on('roomTest', function (_a) {
            var room = _a.room;
            socket.to(room.emit('roomAction', {}));
        });
        socket.on('bringActiveRooms', function () {
            io.emit('showActiveRooms', { activeRooms });
        });
        
        socket.on("addFriend", (idSender, roomId, playerId, name)=>{
            if(!idSender) return;
            if(table.games[roomId]?.playerOne.id === playerId){
                io.to(table.games[roomId]?.playerTwo.id).emit("addFriend", idSender);
                io.to(table.games[roomId]?.playerTwo.id).emit("messages", { msg: `${name}, te ha enviado una solicitud de amistad!` });
            }
            else{
                io.to(table.games[roomId]?.playerOne.id).emit("addFriend", idSender);
                io.to(table.games[roomId]?.playerOne.id).emit("messages", { msg: `${name}, te ha enviado una solicitud de amistad!` });
            }
        });

        socket.on("report", (idReporter, roomId, playerId)=>{
            if(table.games[roomId]?.playerOne.id === playerId){
                io.to(table.games[roomId]?.playerTwo.id).emit("report", idReporter);
                io.to(table.games[roomId]?.playerOne.id).emit("messages", { msg: `Jugador reportado` });
            }
            else{
                io.to(table.games[roomId]?.playerOne.id).emit("report", idReporter);
                io.to(table.games[roomId]?.playerTwo.id).emit("messages", { msg: `Jugador reportado` });
            } 
        });

        socket.on("already friend", (id)=>{
            io.to(id).emit("messages", { msg: `Ya le enviaste una solicitud de amistad` });
        });
        socket.on("already reported",(id)=>{
            io.to(id).emit("messages", { msg: `Ya lo reportaste` });
        })
        
        socket.on("surrender", (roomId, playerId, token)=>{
            if(table.games[roomId]?.playerTwo && table.games[roomId].common){
                axios.put(`http://localhost:3001/api/games/losser/${table.games[roomId].common.gameId}/${table.games[roomId].playerOne.score}/${table.games[roomId].playerTwo.score}`,{},{
                    headers: {
                        "x-access-token": token || 1,
                    }});
                if(table.games[roomId]?.playerOne.id === playerId){
                    io.to(table.games[roomId]?.playerTwo?.id).emit("surrender");
                }
                else{
                    io.to(table.games[roomId]?.playerOne.id).emit("surrender");
                }
            }
            else{
                table.games[roomId]?.common && axios.put(`http://localhost:3001/api/games/winner/${table.games[roomId].common.gameId}/99/99`,{},{
                        headers: {
                            "x-access-token": token || 1,
                        }});
                }
            activeRooms = activeRooms.filter((roomId)=> roomId!= roomId);
        });
        socket.on("surrender2", (roomId, token)=>{
            console.log("entre")
            axios.put(`http://localhost:3001/api/games/winner/${table.games[roomId].common.gameId}/${table.games[roomId].playerOne.score}/${table.games[roomId].playerTwo.score}`,{},{
                    headers: {
                        "x-access-token": token || 1,
                    }});
    
            const clients = io.sockets.adapter.rooms.get(roomId);
            console.log(clients)
            for(const clientId of clients) {
                const clientSocket = io.sockets.sockets.get(clientId);
                clientSocket.leave(roomId)
            };
            delete table.games[roomId];
        });
    });
}
