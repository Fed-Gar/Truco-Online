/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import stylesGame from './styles/game.module.css';
import socket from './socket';
import {useDispatch, useSelector} from 'react-redux'
import Chat from './rooms/Chat';
import { useHistory } from "react-router-dom";
import { setIsInRoom } from '../Redux/actions-types/roomsActions';
import axios from 'axios';
import profileActions from '../Redux/actions-types/profileActions';
import Tutorial from './tutorial/Tutorial';

let turnTime;
let interval;
// let otherTime;
const correctBetName = (betPick)=>{
  let properBet = "";
  if(betPick.includes("no quiero")) properBet = "No Quiero";
  else if(betPick.includes("quiero")) properBet = "Quiero";
  else if(betPick.at(-1) === "1" || betPick.at(-1) === "2") properBet = "Envido";
  else if(betPick === "realEnvido") properBet = "Real Envido";
  else if(betPick === "faltaEnvido") properBet = "Falta Envido";
  else if(betPick === "truco") properBet = "Truco";
  else if(betPick === "retruco") properBet = "Retruco";
  else if(betPick === "valeCuatro") properBet = "Vale Cuatro";
  else if(betPick === "ir al mazo") properBet = "Ir al Mazo";

  return properBet || betPick;
}
export default function Game({
  tournamentMatchId,

  setShowFirstMatch, 
  setFinishedFirstMatch,

  setShowSecondMatch,
  setFinishedSecondMatch,

  setShowThirdMatch,
  setFinishedThirdMatch,

  finishedFirstMatch,
  finishedSecondMatch,
  finishedThirdMatch,

  wins,
  setWins

  }) {
    var roomId = useSelector(store => store.roomsReducer.roomId); //traer el id de la sala en la que esta el jugador
    // let isinRoom = useSelector(store => store.roomsReducer.isInRoom); // traer si esta en sala
    if(tournamentMatchId) roomId = tournamentMatchId;
    const [player, setPlayer] = useState({ //objeto del jugador en el cliente deberia tener solo propiedades que se usan para renderizar o limitar interacciones en el cliente
        id: 1, // socket id del jugador
        name: localStorage.user || "jugador 1", // la idea seria que sea el nombre del profile
        nameRival: "jugador 2",
        score: 0,  // puntaje que lleva
        scoreRival: 0,
        hand: [], // las 3 cartas de la ronda
        turnNumber: 1, // numero de turno
        isTurn: false, //para que pueda o no hacer click
        betOptions: [], // lista de apuesta o respuestas segun el momento
        tableRival: [], // las cartas del oponente en la mesa, tambien puede usarse para calcular cuantas cartas de dorso mostrar
        tablePlayer: [], // cartas del jugador en la mesa
        bet: false, // llevar registro de si aposto
        roundResults: [], //deberia contener el resultado de la mano por ejemplo ["tie", "win", "loss"]
        starts: false, // referencia para cambiar turnos al finalizar ronda
        token: localStorage.token,
      });
    let [newRound, setNewRound] = useState(false);
    let [pointBox, setPointsBox] = useState(false);
    let [isYourTurn, setIsYourTurn] = useState(false);
    let [reported, setReported] = useState(false);
    let [friend, setFriend] = useState(false);
    let [tutorialBox, setTutorialBox] = useState(false);
    let [timesWithoutPlay, setTimesWithoutPlay] = useState(0);
    let [seconds, setSeconds] = useState(30);
    const history = useHistory();
    const scoreBox = useRef();
    const tuto = useRef();
    const {getProfile} = profileActions;
    const { userProfile} = useSelector(state => state.profileReducer);
    const dispatch = useDispatch();

    const addFriend = ()=>{
      if(!friend){
        player?.id && socket.emit("addFriend", localStorage.id, roomId || localStorage.roomId, player.id, player.name);
        setFriend(true);
      }
      else  socket.emit('already friend', player.id);
    };
    const surrender = ()=>{
      socket.emit("surrender", roomId || localStorage.roomId, player.id, localStorage.token);
      dispatch(setIsInRoom({isInRoom: false, roomId: null}));
      setTimeout(()=>history.push("/profile"),300);
      clearTimeout(turnTime);
      // clearTimeout(otherTime);
    };
    const surrender2 = ()=>{
      socket.emit("surrender2", roomId || localStorage.roomId, player.id, localStorage.token);
      dispatch(setIsInRoom({isInRoom: false, roomId: null}));
      setTimeout(()=>history.push("/profile"),300);
      // clearTimeout(otherTime);
      clearTimeout(turnTime);
      alert("El otro jugador se desconecto")
    }
    const tutorial = ()=>{
      /// mostrar valor cartas y explicacion corta de apuestas
      setTutorialBox(!tutorialBox);
    };
    const report = ()=> {
      if(!reported){
        localStorage.id && socket.emit("report", localStorage.id, roomId || localStorage.roomId, player.id);
        setReported(true);
      }
      else  socket.emit('already reported', player.id);
    };
    const showScore = ()=>{
      setPointsBox(!pointBox);
    };
    const bet = e => { //emite la apuesta
      if(player.isTurn){
        socket.emit("bet", e.target.name, roomId || localStorage.roomId, player.id);
        if(e.target.name !== "ir al mazo") setPlayer({...player, bet:true, isTurn:false, betOptions: []});
      };
    };

    const playCard = (card) =>{ //emite carta jugada
      if(player.isTurn && !player.bet){
      setPlayer({...player, hand: player.hand.filter(cardH=> card.id !== cardH.id), tablePlayer: [...player.tablePlayer, card], isTurn: false});
      socket.emit("playCard", card, roomId || localStorage.roomId, player.id);
      };
    };
    
    useEffect(()=>{
      localStorage?.isAuth && dispatch(getProfile({token: localStorage?.token}));
      socket.emit("refresh", localStorage.roomId);
    },[]);
    useEffect(()=>{
      socket.on("gameStarts", player=>{ //escucha gameStarts para iniciar cuando la sala se llena y dejar el estado jugador listo
        setPlayer(player);
      });
      socket.on("newRoundStarts", player1=>{  //escucha para empezar nueva mano
        setPlayer({...player, isTurn: false})
        setNewRound(true);
        setTimeout(()=>setPlayer(player1),3000);
      });
      socket.on("bet", (betOptions, bool, turn)=>{  //trae la apuesta segun turno
        console.log(turn)
        if(turn === undefined) setPlayer({...player, betOptions, bet: bool});
        else setPlayer({...player, betOptions, bet: bool, isTurn: turn});
      });
      socket.on("betting", bool=>{  //cambia el estado de si se esta apostando para bloquear jugar cartas hasta resolverlo
        setPlayer({...player, bet: false, betOptions: [], isTurn: !player.isTurn});
      });
      socket.on("playCard", (card, bool)=>{  //escucha carta jugada por rival
        setPlayer({...player, tableRival:  [...player.tableRival, card], isTurn: bool}); 
      });
      socket.on("updateScore", (score, bool) =>{  //trae cambios en el puntaje
        setPlayer({...player, score: player.score + score, bet: false, isTurn: bool})
      });
      socket.on("changeTurn", (bool)=>{  //cambia turno entre jugadores
        setPlayer({...player, isTurn: bool});
      });
      socket.on("quieroTruco", (bool)=>{
        setPlayer({...player, isTurn: bool, bet: false, betOptions: []});
      });
      socket.on("quieroEnvido1", (bool, score, scoreRival)=>{
        setPlayer({...player, isTurn: bool, bet: false, betOptions: [], score: player.score+ score, scoreRival: player.scoreRival + scoreRival});
      });
      socket.on("envido1", (betOptions, bool)=>{
        setPlayer({...player, betOptions: betOptions, bet: true, isTurn: bool});
      });
      socket.on("updateRivalScore", (score, bool)=>{
        setPlayer({...player, scoreRival: player.scoreRival + score, bet: false, isTurn: bool})
      });
      socket.on("gameEnds", (data) =>{
        let dataCopy = Object.assign({}, data)
        console.log('ESTA ES LA DATA DE GAME ENDS:', dataCopy)
        if(tournamentMatchId){
          if(finishedFirstMatch===false && finishedSecondMatch===false && finishedThirdMatch===false){
            alert("Partida terminada. Ganador:", dataCopy.winner);
            dispatch(setIsInRoom({isInRoom: false, roomId: null}));
            if(dataCopy.winner === localStorage.user) setWins([...wins, dataCopy.winner])
            setShowFirstMatch(false)
            setFinishedFirstMatch(true)
          }
          if(finishedFirstMatch===true && finishedSecondMatch===false && finishedThirdMatch===false){
            alert("Partida terminada. Ganador:", dataCopy.winner);
            dispatch(setIsInRoom({isInRoom: false, roomId: null}));
            if(dataCopy.winner === localStorage.user) setWins([...wins, dataCopy.winner])
            setShowSecondMatch(false)
            setFinishedSecondMatch(true)
          }
          if(finishedFirstMatch===true && finishedSecondMatch===true && finishedThirdMatch===false){
            alert("Partida terminada. Ganador:", dataCopy.winner);
            dispatch(setIsInRoom({isInRoom: false, roomId: null}));
            if(dataCopy.winner === localStorage.user) setWins([...wins, dataCopy.winner])
            setShowThirdMatch(false)
            setFinishedThirdMatch(true)
          }

        } else{
          console.log("termino");
          history.push("/profile");
          alert("El juego termino");
          dispatch(setIsInRoom({isInRoom: false, roomId: null}));
        }
        clearTimeout(turnTime);
        // clearTimeout(otherTime);
      },);
      socket.on("surrender",()=>{
        alert("El otro jugador se rindio, TU GANAS!");
        history.push("/profile");
        socket.emit("surrender2", roomId || localStorage.roomId, localStorage.token);
        dispatch(setIsInRoom({isInRoom: false, roomId: null}));
        clearTimeout(turnTime);
      });
      socket.on("addFriend", (idSender)=>{
        userProfile.email && idSender && axios.post(`http://localhost:3001/api/friends/${idSender}/${userProfile.email}`);
      });
      socket.on("report", idReporter=>{
        userProfile.id && idReporter && axios.post(`http://localhost:3001/api/reports/${idReporter}/${userProfile.id}`);
      });
      socket.on("refresh", player=>setPlayer(player))
      let handler = event =>{
        if(!scoreBox.current.contains(event.target)){
          setPointsBox(false);
        }
      }
      let handlerTuto = event =>{
        if(!tuto.current.contains(event.target)){
          setTutorialBox(false);
        }
      }
      document.addEventListener("mousedown", handler);
      document.addEventListener("mousedown", handlerTuto);
      return () =>{ //limpieza de eventos
        socket.off("gameStarts");
        socket.off('newRoundStarts');
        socket.off("bet");
        socket.off("playCard");
        socket.off("playerOrder");
        socket.off("betting");
        socket.off("changeTurn");
        socket.off("gameEnds");
        socket.off("quieroTruco");
        socket.off("quieroEnvido1");
        socket.off("envido1");
        socket.off("updateScore");
        socket.off("updateRivalScore");
        socket.off("surrender");
        socket.off("addFriend");
        socket.off("refresh");
        document.removeEventListener("mousedown", handler);
        document.removeEventListener("mousedown", handlerTuto)
      };
    },[player]);
    useEffect(()=>{
      setTimeout(()=>setNewRound(false), 3000);
    },[newRound])
    useEffect(()=>{
      setPointsBox(true)
      setTimeout(()=>setPointsBox(false), 2000);
    },[player.score, player.scoreRival])
    useEffect(()=>{
      if(player.isTurn && !isYourTurn && !player.tablePlayer[2]){
        setIsYourTurn(true)
        console.log("is your turn")
        setTimeout(()=>setIsYourTurn(false), 1000);
      }
      if(player.isTurn) {
        interval = setInterval(() => setSeconds(seconds => seconds - 1), 1000);
        // clearTimeout(otherTime);
        if(timesWithoutPlay < 3){
          turnTime = setTimeout(()=>{socket.emit("bet", "ir al mazo", roomId || localStorage.roomId, player.id);setTimesWithoutPlay(++timesWithoutPlay)}, 30*1000);
        }
        else{
          turnTime = setTimeout(()=>surrender(), 10*1000);
        }
      }
      if(!player.isTurn){
        clearTimeout(turnTime);
        // clearTimeout(otherTime);
        clearInterval(interval);
        setSeconds(30);
        // if(player.hand?.length) otherTime = setTimeout(()=>surrender2(), 120*1000);
      } 
    },[player.isTurn])
    console.log(player) //para testing
    return(<div id={stylesGame.gameBackground}>
            <div id={stylesGame.cardZone}>
              <ol >{[...Array(3-player.tableRival.length).keys()].map(card=><div key={card} id={stylesGame.rivalHand}><img src={`/cards/0.webp`} className={stylesGame.cardsImg}/></div>)}</ol>
              <div id={stylesGame.cardsContainer}>
              
                <ol>{player.tableRival?.map(card => <div key={card.id} className={stylesGame.tableCards}><img src={`/cards/${card.id}.webp`}  className={stylesGame.cardsImg}/></div>)}</ol>
                <ol>{player.tablePlayer?.map(card => <div key={card.id} className={stylesGame.tableCards}><img src={`/cards/${card.id}.webp`}  className={stylesGame.cardsImg}/></div>)}</ol>
              </div>
            
            <ol>{player.hand?.map(card => <div key={card.id} onClick={()=>playCard(card)} id={player.isTurn && !player.bet? stylesGame.playerHandActive : stylesGame.playerHand}><img src={`/cards/${card.id}.webp`}  className={stylesGame.cardsImg}/></div>)}</ol><br/>
            </div>

            <div id={stylesGame.points} ref={scoreBox} style={{ display: pointBox? "flex" : "none", position: "absolute",zIndex:"999"}}>
              <div style={{ height: "20%"}}>
                <h2>{player.name}</h2>
                {player.score? <img src={player.score<=30? `/points/${player.score}.png.webp` : "/points/30.png.webp"}/> : <div></div>}
              </div>
              <div style={{ height: "20%"}}>
                <h2>{player.nameRival}</h2>
                {player.scoreRival? <img src={player.scoreRival<=30? `/points/${player.scoreRival}.png.webp` : "/points/30.png.webp"}/> : <div></div>}
              </div>
            </div>

            <div id={stylesGame.containerChat}>
              <div id={stylesGame.optionsButtons}>
                <button className={stylesGame.btnOptions}>{seconds}</button>
                <button className={stylesGame.btnOptions} onClick={showScore}>Puntaje</button>
                <button className={stylesGame.btnOptions} onClick={report}>Reportar</button>
                <button className={stylesGame.btnOptions} onClick={addFriend}>Agregar amigo</button>
                <button className={stylesGame.btnOptions} onClick={surrender}>Salir</button>
                <button className={stylesGame.btnOptions} onClick={tutorial}>❔</button>
              </div>
              <Chat name={player.name} roomId={roomId || localStorage.roomId}/>
                <div id={"betContainer"}>
                  {player.betOptions?.map(betPick=><button onClick={bet} name={betPick} key={betPick} className={player.isTurn? stylesGame.btnBet : stylesGame.btnBetNoTurn}>{correctBetName(betPick)}</button>)}
                </div>
            </div>
            <div><img src={`/cards/shuffle.gif`} style={{display: newRound? "flex" : "none"}} id={player.starts? stylesGame.shuffle1 : stylesGame.shuffle2}/></div>
            <div id={stylesGame.isYourTurn} style={{display: isYourTurn? "flex" : "none"}}><h1>ES TU TURNO</h1></div>
            <div id={stylesGame.tutorial} style={{display: tutorialBox || "none"}} ref={tuto}>
              <Tutorial/>
            </div>
          </div> 
    );
};