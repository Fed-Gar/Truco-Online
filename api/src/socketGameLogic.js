const {table, buildDeck, shuffleDeck, getHands, envidoCount} = require("./socketGameLogicConst")
const axios = require("axios");

let timeOut;
function setNewRound(playerOne, playerTwo, common, isPlayerOne, roomId, points, io, isPlayerTwo){
    if(isPlayerOne){
        playerTwo.score += points;
        playerOne.scoreRival += points;
    }
    else if(isPlayerTwo){
        playerOne.score += points;
        playerTwo.scoreRival += points;
    }
    // check if there is a winner
    if(playerOne.score >= common.scoreToWin || playerTwo.score >= common.scoreToWin){
        if(playerOne.score >= common.scoreToWin){
            io.to(playerOne.id).emit("gameEnds", ({data: table.games[roomId], winner: playerOne.name}));
            io.to(playerTwo.id).emit("gameEnds", ({data: table.games[roomId], winner: playerOne.name}));
        }
        else if(playerTwo.score >= common.scoreToWin){
            io.to(playerOne.id).emit("gameEnds", ({data: table.games[roomId], winner: playerTwo.name}));
            io.to(playerTwo.id).emit("gameEnds", ({data: table.games[roomId], winner: playerTwo.name}));
        }
        delete table.games[roomId];
        return;
    }
    //reiniciar estados de playerOne, Two y common para empezar siguiente ronda
    table.games[roomId].playerOne = {...table.games[roomId].playerOne, turnNumber: 1,
        tableRival: [],
        tablePlayer: [],
        bet: false,
        roundResults: [],}
    table.games[roomId].playerTwo = {...table.games[roomId].playerTwo, turnNumber: 1,
        tableRival: [],
        tablePlayer: [],
        bet: false,
        roundResults: [],}
    table.games[roomId].common = {...table.games[roomId].common, envidoList: [],
        trucoBet: 1,
        envidoBet: 0,
        cumulativeScore: 0,
        roundResults: [],
        turn: 1,}

    let deck = buildDeck(); //contruye deck
    deck = shuffleDeck(deck); //baraja deck
    const [playerAhand, playerBhand] = getHands(deck); //obtiene manos de 3 cartas de dos jugadores

    //manos iniciales al iniciar partida
    table.games[roomId].playerOne.hand = playerAhand;
    table.games[roomId].playerTwo.hand = playerBhand;

    //manos copias al iniciar partida
    table.games[roomId].common.playerOneHand = [...playerAhand];
    table.games[roomId].common.playerTwoHand = [...playerBhand];

    //cambiar de jugador que inicia y apuesta iniciales
    if(table.games[roomId].playerOne.starts){
        table.games[roomId].playerTwo.isTurn = true;
        table.games[roomId].playerOne.isTurn = false;
        table.games[roomId].playerOne.starts = false;
        table.games[roomId].playerTwo.starts = true;
        //dejar las apuestas al comienzo
        table.games[roomId].playerOne.betOptions = table.betsList.firstTurn;
        table.games[roomId].playerTwo.betOptions = table.betsList.firstTurn;
    }
    else{
        table.games[roomId].playerOne.isTurn = true;
        table.games[roomId].playerTwo.isTurn = false;
        table.games[roomId].playerOne.starts = true;
        table.games[roomId].playerTwo.starts = false;
        //dejar las apuestas al comienzo
        table.games[roomId].playerOne.betOptions = table.betsList.firstTurn;
        table.games[roomId].playerTwo.betOptions = table.betsList.firstTurn;
    };
}
function checkWinnerCards(number, playerOne, playerTwo, common, roomId, io){
    if(playerOne.tableRival[number] && playerTwo.tableRival[number] && common.turn === number+1){
        if(playerOne.tablePlayer[number].truco < playerTwo.tablePlayer[number].truco){
            common.roundResults.push("playerOne");
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
            if(common.trucoBet > 1){
                io.to(playerOne.id).emit("bet", table.betsList.noTruco, false, true);
                io.to(playerTwo.id).emit("bet", table.betsList.noTruco, false, false);
            }
            else{
                io.to(playerOne.id).emit("bet", table.betsList.otherTurn, false, true);
                io.to(playerTwo.id).emit("bet", table.betsList.otherTurn, false, false);
            }
            // io.in(roomId).emit("messages", {msg: `Gana ${playerOne.name}!`});
        }
        else if(playerOne.tablePlayer[number].truco > playerTwo.tablePlayer[number].truco){
            common.roundResults.push("playerTwo");
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
            if(common.trucoBet > 1){
                io.to(playerOne.id).emit("bet", table.betsList.noTruco, false, false);
                io.to(playerTwo.id).emit("bet", table.betsList.noTruco, false, true);
            }
            else{
                io.to(playerOne.id).emit("bet", table.betsList.otherTurn, false, false);
                io.to(playerTwo.id).emit("bet", table.betsList.otherTurn, false, true);
            }
            // io.in(roomId).emit("messages", {msg: `Gana ${playerTwo.name}!`});
        }
        else{
            common.roundResults.push("tie");
            if(playerOne.starts){
                playerOne.isTurn = true;
                playerTwo.isTurn = false;
                if(common.trucoBet > 1){
                    io.to(playerOne.id).emit("bet", table.betsList.noTruco, false, true);
                    io.to(playerTwo.id).emit("bet", table.betsList.noTruco, false, false);
                }
                else{
                    io.to(playerOne.id).emit("bet", table.betsList.otherTurn, false, true);
                    io.to(playerTwo.id).emit("bet", table.betsList.otherTurn, false, false);
                }
            }
            else{
                playerOne.isTurn = false;
                playerTwo.isTurn = true;
                if(common.trucoBet > 1){
                    io.to(playerOne.id).emit("bet", table.betsList.noTruco, false, false);
                    io.to(playerTwo.id).emit("bet", table.betsList.noTruco, false, true);
                }
                else{
                    io.to(playerOne.id).emit("bet", table.betsList.otherTurn, false, false);
                    io.to(playerTwo.id).emit("bet", table.betsList.otherTurn, false, true);
                }
            }
            // io.in(roomId).emit("messages", {msg: `Empate`});
        }
        common.turn++;
        // common.trucoBet > 1? io.in(roomId).emit("bet", table.betsList.noTruco, false) : io.in(roomId).emit("bet", table.betsList.otherTurn, false);
    }
}
function noQuieroEnvido(playerOne, playerTwo, isPlayerOne, score, io, isPlayerTwo){
    playerOne.betOptions = [];
    playerOne.bet = false;
    playerTwo.betOptions = [];
    playerTwo.bet = false;
    if(isPlayerOne){
        playerTwo.score += score;
        playerOne.scoreRival += score;
        if(playerOne.starts && !playerOne.tablePlayer[0]){
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
            io.to(playerTwo.id).emit("updateScore", score, false);
            io.to(playerOne.id).emit("updateRivalScore", score, true);
        }
        else if((playerTwo.starts && !playerTwo.tablePlayer[0])){
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
            io.to(playerTwo.id).emit("updateScore", score, true);
            io.to(playerOne.id).emit("updateRivalScore", score, false);
        }
        else if(playerOne.starts){
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
            io.to(playerTwo.id).emit("updateScore", score, true);
            io.to(playerOne.id).emit("updateRivalScore", score, false);
        }
        else{
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
            io.to(playerTwo.id).emit("updateScore", score, false);
            io.to(playerOne.id).emit("updateRivalScore", score, true);
        } 
    }
    else if(isPlayerTwo){
        playerOne.score += score;
        playerTwo.scoreRival += score;
        if(playerOne.starts && !playerOne.tablePlayer[0]){
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
            io.to(playerTwo.id).emit("updateRivalScore", score, false);
            io.to(playerOne.id).emit("updateScore", score, true);
        }
        else if((playerTwo.starts && !playerTwo.tablePlayer[0])){
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
            io.to(playerTwo.id).emit("updateRivalScore", score, true);
            io.to(playerOne.id).emit("updateScore", score, false);
        }
        else if(playerOne.starts){
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
            io.to(playerTwo.id).emit("updateRivalScore", score, true);
            io.to(playerOne.id).emit("updateScore", score, false);
        }
        else{
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
            io.to(playerTwo.id).emit("updateRivalScore", score, false);
            io.to(playerOne.id).emit("updateScore", score, true);
        } 

    }
}
async function endGame(playerOne, playerTwo, common, roomId, io){
    if(playerOne.score >= common.scoreToWin || playerTwo.score >= common.scoreToWin){
        await axios.put(`http://localhost:3001/api/games/${common.gameId}/${playerOne.score}/${playerTwo.score}`);
        if(playerOne.score >= common.scoreToWin){
            await axios.put(`http://localhost:3001/api/games/losser/${common.gameId}/${playerOne.score}/${playerTwo.score}`,{},{
                headers: {
                    "x-access-token": playerTwo.token || 1,
                }})
            await axios.put(`http://localhost:3001/api/games/winner/${common.gameId}/${playerOne.score}/${playerTwo.score}`,{},{
            headers: {
                "x-access-token": playerOne.token || 1,
            }})
            io.to(playerOne.id).emit("gameEnds", ({data: playerOne, winner: playerOne.name}));
            io.to(playerTwo.id).emit("gameEnds", ({data: playerOne, winner: playerOne.name}));
        }
        else if(playerTwo.score >= common.scoreToWin){
            await axios.put(`http://localhost:3001/api/games/losser/${common.gameId}/${playerOne.score}/${playerTwo.score}`,{},{
                headers: {
                    "x-access-token": playerOne.token || 1,
                }})
            await axios.put(`http://localhost:3001/api/games/winner/${common.gameId}/${playerOne.score}/${playerTwo.score}`,{},{
                headers: {
                    "x-access-token": playerTwo.token || 1,
                }})
            io.to(playerOne.id).emit("gameEnds", ({data: playerOne, winner: playerTwo.name}));
            io.to(playerTwo.id).emit("gameEnds", ({data: playerOne, winner: playerTwo.name}));
        }
        // socket.leave(roomId); 
        const clients = io.sockets.adapter.rooms.get(roomId);
        for(const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            clientSocket.leave(roomId)
        };
        delete table.games[roomId];
        return;
    }
}
function quieroEnvido(playerOne, playerOneEnvido, isPlayerOne, playerTwo, playerTwoEnvido, common, roomId, score, bool, io, isPlayerTwo){
    console.log(playerOneEnvido);
    console.log(playerTwoEnvido);
    playerOne.betOptions = [];
    playerOne.bet = false;
    playerTwo.betOptions = [];
    playerTwo.bet = false;
    if(playerOneEnvido > playerTwoEnvido){
        playerOne.score+=score;
        playerTwo.scoreRival+=score;
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),200);
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `${!isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${!isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),400);
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `Gana el envido ${playerOne.name}!`}),800);
        if(isPlayerOne){
            playerOne.isTurn = !bool;
            playerTwo.isTurn = bool;
            io.to(playerTwo.id).emit("quieroEnvido1", bool, 0, score);
            io.to(playerOne.id).emit("quieroEnvido1", !bool, score, 0);
        }
        else if(isPlayerTwo){
            playerOne.isTurn = bool;
            playerTwo.isTurn = !bool;
            io.to(playerOne.id).emit("quieroEnvido1", bool, score, 0);
            io.to(playerTwo.id).emit("quieroEnvido1", !bool, 0, score);
        }
    } 
    else if(playerOneEnvido < playerTwoEnvido){
        playerTwo.score+=score;
        playerOne.scoreRival+=score;
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),200);
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `${!isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${!isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),400);
        setTimeout(()=> io.in(roomId).emit("messages", {msg: `Gana el envido ${playerTwo.name}!`}),800)
        if(isPlayerOne){
            playerOne.isTurn = !bool;
            playerTwo.isTurn = bool;
            io.to(playerTwo.id).emit("quieroEnvido1", bool, score, 0);
            io.to(playerOne.id).emit("quieroEnvido1", !bool, 0, score);
        }
        else if(isPlayerTwo){
            playerOne.isTurn = bool;
            playerTwo.isTurn = !bool;
            io.to(playerOne.id).emit("quieroEnvido1", bool, 0, score);
            io.to(playerTwo.id).emit("quieroEnvido1", !bool, score, 0);
        }
    } 
    else{
        if(playerOne.starts){
            playerOne.score+=score;
            playerTwo.scoreRival+=score;
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),200);
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `${!isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${!isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),400);
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `Empate, gana el envido ${playerOne.name} por empezar turno!`}),800);
            if(isPlayerOne){
                playerOne.isTurn = !bool;
                playerTwo.isTurn = bool;
                io.to(playerTwo.id).emit("quieroEnvido1", bool, 0, score);
                io.to(playerOne.id).emit("quieroEnvido1", !bool, score, 0);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = bool;
                playerTwo.isTurn = !bool;
                io.to(playerOne.id).emit("quieroEnvido1", bool, score, 0);
                io.to(playerTwo.id).emit("quieroEnvido1", !bool, 0, score);
            }
        }
        else{
            playerTwo.score+=score;
            playerOne.scoreRival+=score;
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),200);
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `${!isPlayerOne? playerTwo.name : playerOne.name}: Tengo ${!isPlayerOne? playerTwoEnvido : playerOneEnvido}.`}),400);
            setTimeout(()=> io.in(roomId).emit("messages", {msg: `Empate, gana el envido ${playerTwo.name} por empezar turno!`}),800);
            if(isPlayerOne){
                playerOne.isTurn = !bool;
                playerTwo.isTurn = bool;
                io.to(playerTwo.id).emit("quieroEnvido1", bool, score, 0);
                io.to(playerOne.id).emit("quieroEnvido1", !bool, 0, score);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = bool;
                playerTwo.isTurn = !bool;
                io.to(playerOne.id).emit("quieroEnvido1", bool, 0, score);
                io.to(playerTwo.id).emit("quieroEnvido1", !bool, score, 0);
            }
        }  
    } 
}
function noQuieroFaltaEnvido(playerOne, playerTwo, isPlayerOne, common, noQuieroEnvido, io, isPlayerTwo){
    if(common.envidoList.length === 1 && !common.envidoList.includes("realEnvido")){
        noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 1, io, isPlayerTwo); 
    }
    else if(common.envidoList.length === 2 && !common.envidoList.includes("realEnvido")){
        noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 2, io, isPlayerTwo); 
    }
    else if(common.envidoList.length === 2){
        noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 3, io, isPlayerTwo); 
    }
    else if(common.envidoList.length === 3){
        noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 5, io, isPlayerTwo); 
    }
    else if(common.envidoList.length === 4){
        noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 7, io, isPlayerTwo); 
    }
}

exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
    // reconnection
    console.log(socket.id)
    if(socket.handshake.auth.isInRoom){
        let roomId = socket.handshake.auth.roomId;
        console.log(roomId)
        if(table.games[roomId]?.playerOne.token === socket.handshake.auth.token){
            table.games[roomId].playerOne.id = socket.id;
            socket.join(roomId)
            io.to(table.games[roomId]?.playerOne?.id).emit("refresh", table.games[roomId]?.playerOne);
            io.to(table.games[roomId]?.playerTwo?.id).emit("refresh", table.games[roomId]?.playerTwo);
        }
        else if(table.games[roomId]?.playerTwo.token === socket.handshake.auth.token){
            table.games[roomId].playerTwo.id = socket.id;
            socket.join(roomId)
            io.to(table.games[roomId]?.playerOne?.id).emit("refresh", table.games[roomId]?.playerOne);
            io.to(table.games[roomId]?.playerTwo?.id).emit("refresh", table.games[roomId]?.playerTwo);
        }
        console.log(table.games[roomId])
    }
    //GAME EVENTS

    socket.on("bet", (betPick, roomId, playerId) => {
        console.log(roomId)
        const playerOne = table.games[roomId]?.playerOne;
        const playerTwo = table.games[roomId]?.playerTwo;
        const common = table.games[roomId]?.common;
        const isPlayerOne = playerOne.id === playerId;
        const isPlayerTwo = playerTwo.id === playerId;
        playerOne.bet = true;
        playerTwo.bet = true;
        
        if(betPick === "ir al mazo") {
            setNewRound(playerOne, playerTwo, common, isPlayerOne, roomId, common.trucoBet, io, isPlayerTwo);
            //emitir como deberia cambiar el jugador de cada cliente
            io.to(playerOne.id).emit("newRoundStarts", table.games[roomId]?.playerOne);
            io.to(playerTwo.id).emit("newRoundStarts", table.games[roomId]?.playerTwo);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: IR AL MAZO!`})
        }
        else if(betPick === "quiero truco") {
            common.trucoBet = 2;
            playerOne.betOptions = [];
            playerOne.bet = false;
            playerTwo.betOptions = [];
            playerTwo.bet = false;
            if(isPlayerOne){
                playerOne.isTurn = false;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("quieroTruco", true);
                io.to(playerOne.id).emit("quieroTruco", false);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = true;
                playerTwo.isTurn = false;
                io.to(playerOne.id).emit("quieroTruco", true);
                io.to(playerTwo.id).emit("quieroTruco", false);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO TRUCO!`})  
        }
        else if(betPick === "no quiero truco") {
            setNewRound(playerOne, playerTwo, common, isPlayerOne, roomId, common.trucoBet, io, isPlayerTwo);
            //emitir como deberia cambiar el jugador de cada cliente
            io.to(playerOne.id).emit("newRoundStarts", table.games[roomId].playerOne);
            io.to(playerTwo.id).emit("newRoundStarts", table.games[roomId].playerTwo);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO TRUCO!`})  
        }
        else if(betPick === "quiero retruco") {
            common.trucoBet = 3;
            playerOne.betOptions = [];
            playerOne.bet = false;
            playerTwo.betOptions = [];
            playerTwo.bet = false;
            if(isPlayerOne){
                playerOne.isTurn = true;
                playerTwo.isTurn = false;
                io.to(playerTwo.id).emit("quieroTruco", false);
                io.to(playerOne.id).emit("quieroTruco", true);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = false;
                playerTwo.isTurn = true;
                io.to(playerOne.id).emit("quieroTruco", false);
                io.to(playerTwo.id).emit("quieroTruco", true);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO RETRUCO!`}) 
        }
        else if(betPick === "no quiero retruco") {
            setNewRound(playerOne, playerTwo, common, isPlayerOne, roomId, common.trucoBet, io, isPlayerTwo);
            //emitir como deberia cambiar el jugador de cada cliente
            io.to(playerOne.id).emit("newRoundStarts", table.games[roomId].playerOne);
            io.to(playerTwo.id).emit("newRoundStarts", table.games[roomId].playerTwo);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO RETRUCO!`})       
        }
        else if(betPick === "quiero valeCuatro") {
            common.trucoBet = 4;
            playerOne.betOptions = [];
            playerOne.bet = false;
            playerTwo.betOptions = [];
            playerTwo.bet = false;
            if(isPlayerOne){
                playerOne.isTurn = false;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("quieroTruco", true);
                io.to(playerOne.id).emit("quieroTruco", false);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = true;
                playerTwo.isTurn = false;
                io.to(playerOne.id).emit("quieroTruco", true);
                io.to(playerTwo.id).emit("quieroTruco", false);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO VALE CUATRO!`}) 
        }
        else if(betPick === "no quiero valeCuatro") {
            setNewRound(playerOne, playerTwo, common, isPlayerOne, roomId, common.trucoBet, io, isPlayerTwo);
            //emitir como deberia cambiar el jugador de cada cliente
            io.to(playerOne.id).emit("newRoundStarts", table.games[roomId].playerOne);
            io.to(playerTwo.id).emit("newRoundStarts", table.games[roomId].playerTwo);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO VALE CUATRO!`})     
        }
        else if(betPick === "envido1"){
            common.envidoList.push("envido");
            playerOne.bet = true;
            playerTwo.bet = true;
            if(isPlayerOne){
                playerOne.betOptions = [];
                playerOne.isTurn = false;
                playerTwo.betOptions = table.betsList.envido1;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("envido1", table.betsList.envido1, true);
                io.to(playerOne.id).emit("envido1", [], false);
            }
            else if(isPlayerTwo){
                playerTwo.betOptions = [];
                playerTwo.isTurn = false;
                playerOne.betOptions = table.betsList.envido1;
                playerOne.isTurn = true;
                io.to(playerTwo.id).emit("envido1", [], false);
                io.to(playerOne.id).emit("envido1", table.betsList.envido1, true);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: ENVIDO!`})  
        }
        else if(betPick === "quiero envido1"){
            const playerOneEnvido = envidoCount(common.playerOneHand);
            const playerTwoEnvido = envidoCount(common.playerTwoHand);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO ENVIDO!`});  
            quieroEnvido(playerOne, playerOneEnvido, isPlayerOne, playerTwo, playerTwoEnvido, common, roomId, 2, true, io, isPlayerTwo);            
        }
        else if(betPick === "no quiero envido1"){
            noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 1, io, isPlayerTwo); 
            io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO ENVIDO!`})
        }
        else if(betPick === "envido2"){
            common.envidoList.push("envido");
            if(isPlayerOne){
                playerOne.betOptions = [];
                playerOne.isTurn = false;
                playerTwo.betOptions = table.betsList.envido2;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("envido1", table.betsList.envido2, true);
                io.to(playerOne.id).emit("envido1", [], false);
            }
            else if(isPlayerTwo){
                playerTwo.betOptions = [];
                playerTwo.isTurn = false;
                playerOne.betOptions = table.betsList.envido2;
                playerOne.isTurn = true;
                io.to(playerTwo.id).emit("envido1", [], false);
                io.to(playerOne.id).emit("envido1", table.betsList.envido2, true);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: ENVIDO!`}) 
        }
        else if(betPick === "quiero envido2"){
            const playerOneEnvido = envidoCount(common.playerOneHand);
            const playerTwoEnvido = envidoCount(common.playerTwoHand);
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO ENVIDO!`});
            quieroEnvido(playerOne, playerOneEnvido, isPlayerOne, playerTwo, playerTwoEnvido, common, roomId, 4, false, io, isPlayerTwo);     
        }
        else if(betPick === "no quiero envido2"){
            noQuieroEnvido(playerOne, playerTwo, isPlayerOne, 2, io, isPlayerTwo); 
            io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO ENVIDO!`})
        }
        else if(betPick === "realEnvido"){
            common.envidoList.push("realEnvido");
            if(isPlayerOne){
                playerOne.betOptions = [];
                playerOne.isTurn = false;
                playerTwo.betOptions = table.betsList.realEnvido;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("envido1", table.betsList.realEnvido, true);
                io.to(playerOne.id).emit("envido1", [], false);
            }
            else if(isPlayerTwo){
                playerTwo.betOptions = [];
                playerTwo.isTurn = false;
                playerOne.betOptions = table.betsList.realEnvido;
                playerOne.isTurn = true;
                io.to(playerTwo.id).emit("envido1", [], false);
                io.to(playerOne.id).emit("envido1", table.betsList.realEnvido, true);
            }
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: REAL ENVIDO!`}) 
        }
        else if(betPick === "quiero realEnvido"){
            const playerOneEnvido = envidoCount(common.playerOneHand);
            const playerTwoEnvido = envidoCount(common.playerTwoHand);
            let bool = false;
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO REAL ENVIDO!`})  

            for (let i = 0; i < common.envidoList.length; i++) {
                common.envidoList[i] === "envido"? common.envidoBet += 2 : common.envidoBet +=3;
                bool = !bool;
            }
            quieroEnvido(playerOne, playerOneEnvido, isPlayerOne, playerTwo, playerTwoEnvido, common, roomId, common.envidoBet, bool, io, isPlayerTwo);  
        }
        else if(betPick === "no quiero realEnvido"){
            let bool = false;
            for (let i = 0; i < common.envidoList.length; i++) {
                common.envidoList[i] === "envido"? common.envidoBet += 2 : common.envidoBet +=3;
                bool = !bool;
            }
            common.envidoBet =  Math.floor(common.envidoBet/2);
            if(common.envidoBet === 3) common.envidoBet = 4;
            noQuieroEnvido(playerOne, playerTwo, isPlayerOne, common.envidoBet, io, isPlayerTwo); 
            io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO REAL ENVIDO!`})
        }
        else if(betPick === "faltaEnvido"){
            common.envidoList.push("faltaEnvido");
            if(isPlayerOne){
                playerOne.betOptions = [];
                playerOne.isTurn = false;
                playerTwo.betOptions = table.betsList.faltaEnvido;
                playerTwo.isTurn = true;
                io.to(playerTwo.id).emit("envido1", table.betsList.faltaEnvido, true);
                io.to(playerOne.id).emit("envido1", [], false);
            }
            else if(isPlayerTwo){
                playerTwo.betOptions = [];
                playerTwo.isTurn = false;
                playerOne.betOptions = table.betsList.faltaEnvido;
                playerOne.isTurn = true;
                io.to(playerTwo.id).emit("envido1", [], false);
                io.to(playerOne.id).emit("envido1", table.betsList.faltaEnvido, true);
            };
            io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerOne.name : playerTwo.name}: FALTA ENVIDO!`})
        }
        else if(betPick === "quiero faltaEnvido"){
            const playerOneEnvido = envidoCount(common.playerOneHand);
            const playerTwoEnvido = envidoCount(common.playerTwoHand);
            let bool = false;
            for (let i = 0; i < common.envidoList.length; i++) {
                common.envidoList[i] === "envido"? common.envidoBet += 2 : common.envidoBet +=3;
                bool = !bool;
            }
            let faltaEnvidoScore = 0;
            if(playerOne.score > playerTwo.score){
                faltaEnvidoScore = playerOne.score < 15? 15-playerOne.score : 30-playerOne.score;
            }
            else{
                faltaEnvidoScore = playerTwo.score < 15? 15-playerTwo.score : 30-playerTwo.score;
            }
            quieroEnvido(playerOne, playerOneEnvido, isPlayerOne, playerTwo, playerTwoEnvido, common, roomId, faltaEnvidoScore, bool, io, isPlayerTwo); 
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: QUIERO FALTA ENVIDO!`});
        }
        else if(betPick === "no quiero faltaEnvido"){
            let bool = true;
                for (let i = 0; i < common.envidoList.length; i++) {
                    bool = !bool;
                }
            console.log(common.envidoList)
            if(isPlayerOne){
                noQuieroFaltaEnvido(playerOne, playerTwo, isPlayerOne, common, noQuieroEnvido, io, isPlayerTwo);
            } 
            else if(isPlayerTwo){
                noQuieroFaltaEnvido(playerOne, playerTwo, isPlayerOne, common, noQuieroEnvido, io, isPlayerTwo);
            } 
            io.in(roomId).emit("messages", {msg: `${isPlayerOne? playerOne.name : playerTwo.name}: NO QUIERO FALTA ENVIDO!`}); 
        }
        else{
            playerOne.bet = true;
            playerTwo.bet = true;
            if(isPlayerOne){
                playerOne.isTurn = false;
                playerTwo.isTurn = true;
                playerTwo.betOptions = table.betsList[betPick];
                io.to(playerTwo.id).emit("bet", table.betsList[betPick], true, true);
            }
            else if(isPlayerTwo){
                playerOne.isTurn = true;
                playerTwo.isTurn = false;
                playerOne.betOptions = table.betsList[betPick];
                io.to(playerOne.id).emit("bet", table.betsList[betPick], true, true);
            } 
            io.in(roomId).emit("messages", { msg: `${isPlayerOne? playerOne.name : playerTwo.name}: ${betPick.toUpperCase()}!`});
        }
        endGame(playerOne, playerTwo, common, roomId, io);
        axios.put(`http://localhost:3001/api/games/${common.gameId}/${playerOne.score}/${playerTwo.score}`);   
    });
    socket.on("playCard", (card, roomId, playerId) => {
        const playerOne = table.games[roomId].playerOne;
        const playerTwo = table.games[roomId].playerTwo;
        const common = table.games[roomId].common;
        const isPlayerOne = playerOne.id === playerId;
        const isPlayerTwo = playerTwo.id === playerId;
        if(isPlayerOne){
            playerTwo.tableRival.push(card);
            playerTwo.isTurn = true;
            playerOne.tablePlayer.push(card);
            playerOne.hand = playerOne.hand.filter(cardH=> card.id !== cardH.id);
            playerOne.isTurn = false;
            if(playerOne.tablePlayer[0] && playerTwo.tablePlayer[0] &&
                !playerOne.tablePlayer[1] && !playerTwo.tablePlayer[1] &&
                !playerOne.tablePlayer[2] && !playerTwo.tablePlayer[2]){
                io.to(playerTwo.id).emit("playCard", card, false);
            }
            else if(playerOne.tablePlayer[1] && playerTwo.tablePlayer[1] &&
                !playerOne.tablePlayer[2] && !playerTwo.tablePlayer[2]){
                io.to(playerTwo.id).emit("playCard", card, false);
            }
            else io.to(playerTwo.id).emit("playCard", card, true);
        }
        else if(isPlayerTwo){
            playerOne.tableRival.push(card);
            playerOne.isTurn = true;
            playerTwo.tablePlayer.push(card);
            playerTwo.hand = playerTwo.hand.filter(cardH=> card.id !== cardH.id);
            playerTwo.isTurn = false;
            if(playerOne.tablePlayer[0] && playerTwo.tablePlayer[0] &&
                !playerOne.tablePlayer[1] && !playerTwo.tablePlayer[1] &&
                !playerOne.tablePlayer[2] && !playerTwo.tablePlayer[2]){
                io.to(playerOne.id).emit("playCard", card, false);
            }
            else if(playerOne.tablePlayer[1] && playerTwo.tablePlayer[1]  &&
                !playerOne.tablePlayer[2] && !playerTwo.tablePlayer[2]){
                io.to(playerOne.id).emit("playCard", card, false);
            }
            else io.to(playerOne.id).emit("playCard", card, true);
        }

        checkWinnerCards(0, playerOne, playerTwo, common, roomId, io);
        checkWinnerCards(1, playerOne, playerTwo, common, roomId, io);
        checkWinnerCards(2, playerOne, playerTwo, common, roomId, io);

        console.log(common.roundResults)
        //revisar ganador de mano
        if(common.roundResults.length >= 2){
            let winner = false;
            if((common.roundResults.filter(round => round === "playerOne").length > 1) || 
            (common.roundResults.filter(round => round === "tie").length === 2 && common.roundResults.some(round => round === "playerOne")) ||
            common.roundResults.every(round => round === "tie") && common.roundResults.length === 3 && playerOne.starts){
                winner = true;
                playerOne.score += common.trucoBet;
                playerTwo.scoreRival += common.trucoBet;
                io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerOne.name}!`});
            }
            else if((common.roundResults.filter(round => round === "playerTwo").length > 1) || 
            (common.roundResults.filter(round => round === "tie").length === 2 && common.roundResults.some(round => round === "playerTwo"))||
            common.roundResults.every(round => round === "tie") && common.roundResults.length === 3 && playerTwo.starts){
                winner = true;
                playerTwo.score += common.trucoBet;
                playerOne.scoreRival += common.trucoBet;
                io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerTwo.name}!`});
            }
            else if(common.roundResults.length === 2 && common.roundResults[0] === "tie" && common.roundResults[1] !== "tie"){
                winner = true;
                if(common.roundResults[1] === "playerOne"){
                    playerTwo.score += common.trucoBet;
                    playerOne.scoreRival += common.trucoBet;
                    io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerOne.name}!`});
                }
                else if(common.roundResults[1] === "playerTwo"){
                    playerOne.score += common.trucoBet;
                    playerTwo.scoreRival += common.trucoBet;
                    io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerTwo.name}!`});
                }
            }
            else if(common.roundResults.length === 3){
                winner = true;
                if(common.roundResults[0] === "playerOne"){
                    playerTwo.score += common.trucoBet;
                    playerOne.scoreRival += common.trucoBet;
                    io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerOne.name}!`});
                }
                else if(common.roundResults[0] === "playerTwo"){
                    playerOne.score += common.trucoBet;
                    playerTwo.scoreRival += common.trucoBet;
                    io.in(roomId).emit("messages", {msg: `GANADOR MANO ${playerTwo.name}!`});
                }
            }
            //revisar si algun jugador ya gano antes de iniciar nueva mano
            endGame(playerOne, playerTwo, common, roomId, io);
            
            if(winner){
                //reiniciar estados de playerOne, Two y common para empezar siguiente ronda
                table.games[roomId].playerOne = {...table.games[roomId].playerOne, turnNumber: 1,
                    tableRival: [],
                    tablePlayer: [],
                    bet: false,
                    roundResults: [],}
                table.games[roomId].playerTwo = {...table.games[roomId].playerTwo, turnNumber: 1,
                    tableRival: [],
                    tablePlayer: [],
                    bet: false,
                    roundResults: [],}
                table.games[roomId].common = {...table.games[roomId].common, envidoList: [],
                    trucoBet: 1,
                    envidoBet: 0,
                    cumulativeScore: 0,
                    roundResults: [],
                    turn: 1,}

                let deck = buildDeck(); //contruye deck
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
        
                //cambiar de jugador que inicia
                if(table.games[roomId].playerOne.starts){
                    table.games[roomId].playerTwo.isTurn = true;
                    table.games[roomId].playerOne.isTurn = false;
                    table.games[roomId].playerOne.starts = false;
                    table.games[roomId].playerTwo.starts = true;
                }else{
                    table.games[roomId].playerOne.isTurn = true;
                    table.games[roomId].playerTwo.isTurn = false;
                    table.games[roomId].playerOne.starts = true;
                    table.games[roomId].playerTwo.starts = false;
                };
                //emitir como deberia cambiar el jugador de cada cliente
                io.to(table.games[roomId].playerOne.id).emit("newRoundStarts", table.games[roomId].playerOne);
                io.to(table.games[roomId].playerTwo.id).emit("newRoundStarts", table.games[roomId].playerTwo);
                }
                axios.put(`http://localhost:3001/api/games/${common.gameId}/${playerOne.score}/${playerTwo.score}`);
        }
        
    });
    socket.on("changeTurn", (roomId, playerId)=>{
        if(table.games[roomId].playerOne.id === playerId){
            io.to(table.games[roomId].playerTwo.id).emit("changeTurn", false);
            io.to(table.games[roomId].playerOne.id).emit("changeTurn", true);
        }
        else{
            io.to(table.games[roomId].playerTwo.id).emit("changeTurn", true);
            io.to(table.games[roomId].playerOne.id).emit("changeTurn", false);
        }
    }); 
    socket.on("refresh", (roomId)=>{
        console.log("refresh")
        // const clients = io.sockets.adapter.rooms.get(roomId);
        // for(const clientId of clients) {
        //     const clientSocket = io.sockets.sockets.get(clientId);
            io.to(table.games[roomId]?.playerOne?.id).emit("refresh", table.games[roomId]?.playerOne);
            io.to(table.games[roomId]?.playerTwo?.id).emit("refresh", table.games[roomId]?.playerTwo);
        // };
    })
    });
}
